<template>

  <CoreBase
    :immersivePage="false"
    :authorized="userIsAuthorized"
    authorizedRole="adminOrCoach"
    :showSubNav="true"
  >
    <TopNavbar slot="sub-nav" />

    <KPageContainer>
      <PlanHeader />
      <div class="ta-r">
        <KButton
          class="new-group-button"
          :text="$tr('newGroup')"
          :primary="true"
          @click="openCreateGroupModal"
        />
      </div>

      <CoreTable>
        <thead slot="thead">
          <tr>
            <th>
              {{ coachStrings.$tr('nameLabel') }}
            </th>
            <th>
              {{ coachStrings.$tr('learnersLabel') }}
            </th>
            <th></th>
          </tr>

        </thead>
        <tbody slot="tbody">
          <GroupRowTr
            v-for="group in sortedGroups"
            :key="group.id"
            :group="group"
            @rename="openRenameGroupModal"
            @delete="openDeleteGroupModal"
          />
        </tbody>
      </CoreTable>

      <p v-if="!sortedGroups.length">
        {{ $tr('noGroups') }}
      </p>

      <CreateGroupModal
        v-if="showCreateGroupModal"
        :groups="sortedGroups"
        @success="handleSuccessCreateGroup"
      />

      <RenameGroupModal
        v-if="showRenameGroupModal"
        :groupName="selectedGroup.name"
        :groupId="selectedGroup.id"
        :groups="sortedGroups"
      />

      <DeleteGroupModal
        v-if="showDeleteGroupModal"
        :groupName="selectedGroup.name"
        :groupId="selectedGroup.id"
        @success="handleSuccessDeleteGroup"
      />

    </KPageContainer>
  </CoreBase>

</template>


<script>

  import { mapState, mapActions } from 'vuex';
  import orderBy from 'lodash/orderBy';
  import KButton from 'kolibri.coreVue.components.KButton';
  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import commonCoach from '../../common';
  import PlanHeader from '../../plan/PlanHeader';
  import { GroupModals } from '../../../constants';
  import CreateGroupModal from './CreateGroupModal';
  import GroupRowTr from './GroupRow';
  import RenameGroupModal from './RenameGroupModal';
  import DeleteGroupModal from './DeleteGroupModal';

  export default {
    name: 'GroupsPage',
    components: {
      CoreTable,
      PlanHeader,
      KButton,
      GroupRowTr,
      CreateGroupModal,
      RenameGroupModal,
      DeleteGroupModal,
    },
    mixins: [commonCoach],
    data() {
      return {
        selectedGroup: {
          name: '',
          id: '',
        },
      };
    },
    computed: {
      ...mapState('groups', ['groupModalShown', 'groups']),
      showCreateGroupModal() {
        return this.groupModalShown === GroupModals.CREATE_GROUP;
      },
      showRenameGroupModal() {
        return this.groupModalShown === GroupModals.RENAME_GROUP;
      },
      showDeleteGroupModal() {
        return this.groupModalShown === GroupModals.DELETE_GROUP;
      },
      sortedGroups() {
        return orderBy(this.groups, [group => group.name.toUpperCase()], ['asc']);
      },
    },
    methods: {
      ...mapActions('groups', ['displayModal']),
      ...mapActions(['createSnackbar']),
      openCreateGroupModal() {
        this.displayModal(GroupModals.CREATE_GROUP);
      },
      openRenameGroupModal(groupName, groupId) {
        this.selectedGroup = {
          name: groupName,
          id: groupId,
        };
        this.displayModal(GroupModals.RENAME_GROUP);
      },
      openDeleteGroupModal(groupName, groupId) {
        this.selectedGroup = {
          name: groupName,
          id: groupId,
        };
        this.displayModal(GroupModals.DELETE_GROUP);
      },
      handleSuccessCreateGroup() {
        this.createSnackbar(this.coachStrings.$tr('createdNotification'));
        this.displayModal(false);
      },
      handleSuccessDeleteGroup() {
        this.createSnackbar(this.coachStrings.$tr('deletedNotification'));
        this.displayModal(false);
      },
    },
    $trs: {
      classGroups: 'Groups',
      newGroup: 'New group',
      noGroups: 'You do not have any groups',
      documentTitle: 'Groups',
    },
  };

</script>


<style lang="scss" scoped>

  .ta-r {
    text-align: right;
  }

</style>
