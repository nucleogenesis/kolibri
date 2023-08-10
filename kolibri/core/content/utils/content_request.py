import logging
import uuid

from django.core.management import call_command
from django.db.models import BigIntegerField
from django.db.models import BooleanField
from django.db.models import Case
from django.db.models import Exists
from django.db.models import OuterRef
from django.db.models import QuerySet
from django.db.models import Subquery
from django.db.models import Sum
from django.db.models import Value
from django.db.models import When
from django.db.models.expressions import CombinedExpression
from django.db.models.functions import Coalesce
from morango.models.core import SyncSession

from kolibri.core.auth.models import Facility
from kolibri.core.auth.models import FacilityUser
from kolibri.core.content.models import ContentDownloadRequest
from kolibri.core.content.models import ContentNode
from kolibri.core.content.models import ContentRemovalRequest
from kolibri.core.content.models import ContentRequestReason
from kolibri.core.content.models import ContentRequestStatus
from kolibri.core.content.models import File
from kolibri.core.content.utils.assignment import ContentAssignmentManager
from kolibri.core.content.utils.assignment import DeletedAssignment
from kolibri.core.content.utils.channel_import import import_channel_from_data
from kolibri.core.content.utils.resource_import import (
    ContentDownloadRequestResourceImportManager,
)
from kolibri.core.content.utils.settings import allow_non_local_download
from kolibri.core.content.utils.settings import get_free_space_for_downloads
from kolibri.core.device.models import DeviceStatus
from kolibri.core.device.models import LearnerDeviceStatus
from kolibri.core.device.utils import get_device_setting
from kolibri.core.discovery.models import ConnectionStatus
from kolibri.core.discovery.models import NetworkLocation
from kolibri.core.discovery.utils.network.client import NetworkClient
from kolibri.core.discovery.utils.network.connections import capture_connection_state
from kolibri.core.discovery.utils.network.errors import NetworkLocationResponseFailure
from kolibri.core.utils.urls import reverse_path
from kolibri.utils.data import bytes_for_humans


logger = logging.getLogger(__name__)


# request statuses that signify incomplete requests
INCOMPLETE_STATUSES = [
    ContentRequestStatus.Failed,
    ContentRequestStatus.Pending,
]


class FixedExists(Exists):
    """
    Exists() subquery that allows positional arguments, to get around issue:
    TypeError: resolve_expression() takes from 1 to 2 positional arguments but 6 were given
    """

    def resolve_expression(self, query=None, *args, **kwargs):
        # @see Exists.resolve_expression
        self.queryset = self.queryset.order_by()
        return Subquery.resolve_expression(self, query, *args, **kwargs)


def create_content_download_requests(facility, assignments):
    logger.info("Processing new content assignment requests")
    for assignment in assignments:
        related_removals = ContentRemovalRequest.objects.filter(
            reason=ContentRequestReason.SyncInitiated,
            source_model=assignment.source_model,
            source_id=assignment.source_id,
        )
        # delete any related removal requests
        related_removals.delete()

        ContentDownloadRequest.objects.get_or_create(
            defaults=dict(
                facility_id=facility.id,
                reason=ContentRequestReason.SyncInitiated,
                status=ContentRequestStatus.Pending,
            ),
            source_model=assignment.source_model,
            source_id=assignment.source_id,
            contentnode_id=assignment.contentnode_id,
        )


def create_content_removal_requests(facility, removable_assignments):
    logger.info("Processing new content removal requests")
    for assignment in removable_assignments:
        related_downloads = ContentDownloadRequest.objects.filter(
            reason=ContentRequestReason.SyncInitiated,
            source_model=assignment.source_model,
            source_id=assignment.source_id,
        )
        if isinstance(assignment, DeletedAssignment):
            # for completed downloads, we'll go through contentnode_ids and add removals
            removed_contentnode_ids = related_downloads.values_list(
                "contentnode_id", flat=True
            ).distinct()
        else:
            removed_contentnode_ids = [assignment.contentnode_id]

        for contentnode_id in removed_contentnode_ids:
            ContentRemovalRequest.objects.get_or_create(
                defaults=dict(
                    facility_id=facility.id,
                    reason=ContentRequestReason.SyncInitiated,
                    status=ContentRequestStatus.Pending,
                ),
                source_model=assignment.source_model,
                source_id=assignment.source_id,
                contentnode_id=contentnode_id,
            )

        # delete any related download requests
        related_downloads.delete()


def synchronize_content_requests(dataset_id, transfer_session=None):
    """
    Synchronizes content download and removal requests with models that dictate assignment, like
    Lessons and Exams. Any model that attaches the `ContentAssignmentManager` will allow this.

    :param dataset_id: The UUID of the dataset
    :param transfer_session: The sync's transfer session model, if available
    """
    facility = Facility.objects.get(dataset_id=dataset_id)

    if transfer_session is None and dataset_id is None:
        raise ValueError("Either dataset_id or transfer_session_id is required")

    # transfer_session_id takes precedence over dataset_id, since it's more specific
    # (a transfer session should only affect one dataset)
    find_kwargs = {}
    if transfer_session:
        find_kwargs.update(transfer_session_id=transfer_session.id)
    else:
        find_kwargs.update(dataset_id=dataset_id)

    assignments = ContentAssignmentManager.find_all_downloadable_assignments(
        **find_kwargs
    )
    removable_assignments = ContentAssignmentManager.find_all_removable_assignments(
        **find_kwargs
    )

    create_content_download_requests(facility, assignments)
    create_content_removal_requests(facility, removable_assignments)


def _get_preferred_network_location(instance_id=None, version_filter=None):
    """
    Finds the preferred network location (peer) for importing content

    :param instance_id: an ID to check if available, instead of the most recent sync peers
    :param version_filter: a version range used to filter instances
    :return: A NetworkLocation if available
    :rtype: NetworkLocation
    """
    filters = dict()

    # if we're looking for a specific instance ID, we don't worry about filtering on
    # subset_of_users_device
    if instance_id is None:
        filters.update(subset_of_users_device=False)

    if instance_id:
        # we assume this peer is a somewhat trusted peer
        instance_ids = [instance_id]
    else:
        # find the server instance ID for the latest sync session having a matching network location
        # that is not a SoUD and its connection status is currently okay
        instance_ids = SyncSession.objects.order_by(
            "-last_activity_timestamp"
        ).values_list("server_instance_id", flat=True)

    # we can't combine this into one SQL query because the tables live in separate sqlite DBs
    for instance_id in instance_ids:
        try:
            peer = NetworkLocation.objects.get(
                instance_id=instance_id.hex
                if isinstance(instance_id, uuid.UUID)
                else instance_id,
                **filters
            )
            # if we're on a metered connection, we only want to download from local peers
            if not peer.is_local and not allow_non_local_download():
                logger.debug(
                    "Non-local peer {} excluded when using metered connection".format(
                        instance_id
                    )
                )
                continue
            # ensure peer is available, unless reserved
            if not peer.reserved and peer.connection_status != ConnectionStatus.Okay:
                logger.debug("Peer {} is not available".format(instance_id))
                continue
            # ensure version is applicable according to filter
            if version_filter is not None and not peer.matches_version(version_filter):
                logger.debug(
                    "Peer {} does not match version filter".format(instance_id)
                )
                continue
            return peer
        except NetworkLocation.DoesNotExist:
            continue
    return None


def _total_size(*querysets):
    """
    :type querysets: django.db.models.QuerySet[]
    :return: int
    """
    total_size = 0
    for queryset in querysets:
        total_size += (
            queryset.aggregate(sum_size=Sum("total_size")).get("sum_size", 0) or 0
        )
    return total_size


def _node_total_size(contentnode_id, available=False):
    """
    Returns a subquery to determine the total size of needed files not yet imported
    :param contentnode_id: A contentnode ID or OuterRef to ID field
    :param available: Whether to filter on available files
    """
    return Coalesce(
        Subquery(
            File.objects.filter(
                contentnode_id=contentnode_id,
                local_file__available=available,
            )
            .annotate(total_size=Sum("local_file__file_size"))
            .values("total_size"),
            output_field=BigIntegerField(),
        ),
        Value(0),
        output_field=BigIntegerField(),
    )


def _total_size_annotation(available=False):
    """
    Returns a subquery to determine the total size of needed files not yet imported
    """
    # we check the parent and the node itself, since we'll generally want to import the parent
    # topic/folder for the resource, and it may have thumbnails
    return CombinedExpression(
        # the requested node's size
        _node_total_size(OuterRef("contentnode_id"), available=available),
        "+",
        # the requested node's parent's size
        Coalesce(
            Subquery(
                ContentNode.objects.filter(id=OuterRef("contentnode_id"))
                .annotate(
                    parent_total_size=_node_total_size(
                        OuterRef("parent_id"), available=available
                    )
                )
                .values("parent_total_size"),
                output_field=BigIntegerField(),
            ),
            Value(0),
            output_field=BigIntegerField(),
        ),
        output_field=BigIntegerField(),
    )


def incomplete_downloads_queryset():
    """
    Returns a queryset used to determine the incomplete downloads, with and without metadata, as
    well as the total import size if it does have metadata
    """
    qs = (
        ContentDownloadRequest.objects.filter(status__in=INCOMPLETE_STATUSES)
        .order_by("requested_at")
        .annotate(
            has_metadata=Exists(
                ContentNode.objects.filter(pk=OuterRef("contentnode_id"))
            ),
            total_size=_total_size_annotation(),
            is_learner_download=Case(
                When(
                    source_model=FacilityUser.morango_model_name,
                    then=FixedExists(
                        FacilityUser.objects.filter(
                            id=OuterRef("source_id"),
                            roles__isnull=True,
                        )
                    ),
                ),
                default=Value(False),
                output_field=BooleanField(),
            ),
        )
    )
    # if we're not allowing learner downloads, filter them out
    if not get_device_setting("allow_learner_download_resources"):
        qs = qs.exclude(is_learner_download=True)
    return qs


def completed_downloads_queryset():
    """
    Returns a queryset used to determine the completed downloads, with and without metadata, as
    well as the total import size if it does have metadata
    """
    return (
        ContentDownloadRequest.objects.filter(status__in=ContentRequestStatus.Completed)
        .order_by("requested_at")
        .annotate(
            has_metadata=Exists(
                ContentNode.objects.filter(pk=OuterRef("contentnode_id"))
            ),
            total_size=_total_size_annotation(available=True),
        )
    )


class InsufficientStorage(Exception):
    """
    Dedicated exception with which we can halt content request processing for insufficient storage
    """

    pass


class NoPeerAvailable(Exception):
    """
    Dedicated exception with which we can halt content request processing when we don't have a peer
    """

    pass


def process_content_requests():
    """
    Wrapper around the processing of content requests to capture errors
    """
    logger.debug("Processing content requests")
    incomplete_downloads = incomplete_downloads_queryset()

    # first, process the metadata import for any incomplete downloads without metadata
    incomplete_downloads_without_metadata = incomplete_downloads.filter(
        has_metadata=False
    )
    if incomplete_downloads_without_metadata.exists():
        logger.debug("Attempting to import missing metadata before content import")
        process_metadata_import(incomplete_downloads_without_metadata)

    try:
        logger.debug("Starting automated import of content")
        _process_content_requests(incomplete_downloads)
        # must have completed downloads, we can clear any 'InsufficientStorage' statuses
        LearnerDeviceStatus.clear_statuses()
    except InsufficientStorage as e:
        logger.warning(str(e))
        LearnerDeviceStatus.save_statuses(DeviceStatus.InsufficientStorage)
    except NoPeerAvailable as e:
        logger.warning(str(e))


def _get_import_metadata(client, contentnode_id):
    """
    :type client: NetworkClient
    :type contentnode_id: str
    :rtype: None|dict
    """
    url_path = reverse_path(
        "kolibri:core:importmetadata-detail", kwargs={"pk": contentnode_id}
    )
    try:
        response = client.get(url_path)
        return response.json()
    except NetworkLocationResponseFailure as e:
        # 400 level errors, like 404, are ignored
        if e.response and 400 <= e.response.status_code < 500:
            logger.debug(
                "Metadata request failure: GET {} {}".format(
                    url_path, e.response.status_code
                )
            )
            return None
        raise e


def _import_metadata(client, contentnode_ids):
    """
    :type client: NetworkClient
    :param contentnode_ids: a values_list QuerySet of content node ids or list of them
    :type contentnode_ids: QuerySet or list
    """
    total_count = (
        contentnode_ids.count()
        if isinstance(contentnode_ids, QuerySet)
        else len(contentnode_ids)
    )
    # quick exit, without log noise, if nothing to do
    if not total_count:
        logging.debug("No content metadata to import")
        return
    processed_count = 0
    logger.info("Importing content metadata for {} nodes".format(total_count))
    for contentnode_id in contentnode_ids:
        import_metadata = _get_import_metadata(client, contentnode_id)
        # if the request 404'd, then we wouldn't have this data
        if import_metadata:
            processed_count += 1
            import_channel_from_data(import_metadata, cancel_check=False, partial=True)
            if processed_count % 10 == 0:
                logger.info(
                    "Imported content metadata for {} out of {} nodes".format(
                        processed_count, total_count
                    )
                )
        else:
            logger.warning(
                "Failed to import content metadata for {}".format(contentnode_id)
            )
    logger.info("Imported content metadata for {} nodes".format(processed_count))


def process_metadata_import(incomplete_downloads_without_metadata):
    """
    Processes metadata import for a queryset already filtered to those without metadata
    :param incomplete_downloads_without_metadata: a ContentDownloadRequest queryset
    :type incomplete_downloads_without_metadata: django.db.models.QuerySet
    """
    source_instance_ids = list(
        incomplete_downloads_without_metadata.values_list(
            "source_instance_id", flat=True
        ).distinct()
    )
    # append `None` which will bypass the explicit peer selection and use a trusted peer
    # of a recent sync, if available, during the last step of the process
    source_instance_ids.append(None)
    peers = []

    for source_instance_id in source_instance_ids:
        # get the peer for this source instance
        peer = _get_preferred_network_location(
            instance_id=source_instance_id, version_filter=">=0.16.0"
        )
        if not peer:
            continue

        # store all available peers, so we can fall back to them if later preferred peers fail
        peers.append(peer)
        filters = dict()
        if source_instance_id is not None:
            filters["source_instance_id"] = source_instance_id

        # start with the most recent peer, and work backwards
        for peer in reversed(peers):
            # during processing, if there's a critical failure in making requests to the peer,
            # this will capture those errors, and obviously the raising of exceptions
            # will interrupt processing
            with capture_connection_state(peer):
                with NetworkClient.build_from_network_location(peer) as client:
                    # test connection
                    client.connect()
                    _import_metadata(
                        client,
                        incomplete_downloads_without_metadata.filter(
                            **filters
                        ).values_list("contentnode_id", flat=True),
                    )

    unprocessed_count = incomplete_downloads_without_metadata.count()
    if unprocessed_count > 0:
        logger.info(
            "No acceptable peer device for importing content metadata for {} nodes".format(
                unprocessed_count
            )
        )


def _process_content_requests(incomplete_downloads):
    """
    Processes content requests, both for downloading and removing content
    """
    incomplete_downloads_with_metadata = incomplete_downloads.filter(has_metadata=True)

    # obtain the incomplete removals, that do not have an associated download
    incomplete_removals = (
        ContentRemovalRequest.objects.annotate(
            has_download=Exists(
                ContentDownloadRequest.objects.filter(
                    contentnode_id=OuterRef("contentnode_id")
                ).exclude(
                    # has a download that isn't from the same model
                    source_model=OuterRef("source_model"),
                    source_id=OuterRef("source_id"),
                )
            ),
            is_admin_imported=Exists(
                ContentNode.objects.filter(
                    id=OuterRef("contentnode_id"),
                    admin_imported=True,
                )
            ),
        )
        .filter(
            status__in=INCOMPLETE_STATUSES,
        )
        .exclude(
            # hoping using exclude creates SQL like `NOT EXISTS`
            has_download=True,
            is_admin_imported=True,
        )
        .order_by("requested_at")
    )
    incomplete_sync_removals = incomplete_removals.filter(
        reason=ContentRequestReason.SyncInitiated
    )
    incomplete_user_removals = incomplete_removals.filter(
        reason=ContentRequestReason.UserInitiated
    )
    complete_user_downloads = ContentDownloadRequest.objects.filter(
        status=ContentRequestStatus.Completed, reason=ContentRequestReason.UserInitiated
    )

    # loop while we have pending downloads
    while incomplete_downloads_with_metadata.exists():
        free_space = get_free_space_for_downloads(
            completed_size=_total_size(completed_downloads_queryset())
        )

        # grab the next request that will fit within current free space
        download_request = incomplete_downloads_with_metadata.filter(
            total_size__lte=free_space
        ).first()

        if download_request is not None:
            process_download_request(download_request)
        else:
            logger.debug(
                "Did not find suitable download request for free space {}".format(
                    free_space
                )
            )
            if incomplete_sync_removals.exists():
                # process, then repeat
                logger.info("Processing sync-initiated content removal requests")
                process_content_removal_requests(incomplete_sync_removals)
                continue
            if incomplete_user_removals.exists():
                # process, then repeat
                logger.info("Processing user-initiated content removal requests")
                process_content_removal_requests(incomplete_user_removals)
                continue
            if complete_user_downloads.exists():
                # process, then repeat
                process_user_downloads_for_removal()
                continue
            raise InsufficientStorage(
                "Content download requests need {} of free space".format(
                    bytes_for_humans(_total_size(incomplete_downloads_with_metadata))
                )
            )


def process_download_request(download_request):
    """
    Processes a download request
    :type download_request: ContentDownloadRequest
    """
    peers = []
    # we do not need to filter by version, since content import should work for any
    preferred_peer = _get_preferred_network_location(
        instance_id=download_request.source_instance_id
    )
    if preferred_peer:
        peers.append(preferred_peer)

    # if we had a preferred peer, add a fallback peer
    if download_request.source_instance_id is not None:
        fallback_peer = _get_preferred_network_location()
        if fallback_peer:
            peers.append(fallback_peer)

    if not peers:
        # if we're processing download requests, and this happens, no use continuing
        raise NoPeerAvailable("Could not find available peer for content import")

    logger.info(
        "Processing content import request for node {}".format(
            download_request.contentnode_id
        )
    )
    # mark request as processing
    download_request.status = ContentRequestStatus.InProgress
    download_request.save()

    try:
        # by this point we should have a ContentNode
        channel_id = ContentNode.objects.get(
            pk=download_request.contentnode_id
        ).channel_id

        for peer in peers:
            import_manager = ContentDownloadRequestResourceImportManager(
                channel_id,
                peer_id=peer.id,
                baseurl=peer.base_url,
                node_ids=[download_request.contentnode_id],
                download_request=download_request,
            )
            _, count = import_manager.run()
            if count > 0:
                break
        else:
            raise NoPeerAvailable(
                "Unable to import {} from peers".format(download_request.contentnode_id)
            )

        download_request.status = ContentRequestStatus.Completed
        download_request.save()
    except Exception as e:
        logger.exception(e)
        download_request.status = ContentRequestStatus.Failed
        download_request.save()


def process_user_downloads_for_removal():
    """
    Simplistic approach to removing user downloads, starting with largest and working down
    """
    user_downloads = (
        ContentDownloadRequest.objects.filter(
            reason=ContentRequestReason.UserInitiated,
            status=ContentRequestStatus.Completed,
        )
        .annotate(
            total_size=_total_size_annotation(),
            has_other_download=Exists(
                ContentDownloadRequest.objects.filter(
                    contentnode_id=OuterRef("contentnode_id")
                ).exclude(
                    # has a download that isn't from the same model
                    source_model=OuterRef("source_model"),
                    source_id=OuterRef("source_id"),
                )
            ),
        )
        .exclude(
            has_other_download=True,
        )
    )

    # TODO: add more sophisticated logic for choosing which user downloads to remove, like based
    # off the user's interaction with the resource, e.g. complete status
    largest_user_download = user_downloads.order_by("-total_size").first()

    # adding this opposite of the user download request allows us to detect this situation
    user_download_removal = ContentRemovalRequest(
        facility_id=largest_user_download.facility_id,
        source_model=largest_user_download.source_model,
        source_id=largest_user_download.source_id,
        reason=ContentRequestReason.SyncInitiated,
        status=ContentRequestStatus.Pending,
        contentnode_id=largest_user_download.contentnode_id,
    )
    # this removal request will be processed on the next loop
    user_download_removal.save()
    logger.info(
        "Added removal request for user download of {}".format(
            largest_user_download.contentnode_id
        )
    )


def process_content_removal_requests(queryset):
    """
    Garbage collects content requests marked for removal (removed_at is not null)

    :param queryset: a ContentRemovalRequest queryset
    :type queryset: django.db.models.QuerySet
    """
    # exclude admin imported nodes
    removable_nodes = ContentNode.objects.filter(
        admin_imported=False,
        id__in=queryset.values_list("contentnode_id", flat=True).distinct(),
        available=True,
    )
    channel_ids = removable_nodes.values_list("channel_id", flat=True).distinct()

    for channel_id in channel_ids:
        contentnode_ids = removable_nodes.filter(channel_id=channel_id).values_list(
            "id", flat=True
        )
        channel_requests = queryset.filter(contentnode_id__in=contentnode_ids)
        channel_requests.update(status=ContentRequestStatus.InProgress)
        try:
            call_command(
                "deletecontent",
                channel_id,
                node_ids=list(contentnode_ids),
                force_delete=True,
            )
            channel_requests.update(status=ContentRequestStatus.Completed)
        except Exception as e:
            logger.exception(e)
            channel_requests.update(status=ContentRequestStatus.Failed)

    # lastly, update all incomplete as completed, since they must have been excluded
    # as already unavailable
    queryset.filter(status__in=INCOMPLETE_STATUSES).update(
        status=ContentRequestStatus.Completed
    )
