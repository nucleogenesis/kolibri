import { ref } from 'kolibri.lib.vueCompositionApi';
import { ChannelResource, ContentNodeResource, ContentNodeSearchResource } from 'kolibri.resources';
import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
//import { set } from '@vueuse/core';
// import pickBy from 'lodash/pickBy';
import uniq from 'lodash/uniq';
//import { QuizResource } from '../composables/quizCreationSpecs';
// import store from 'kolibri.coreVue.vuex.store';

export function useExerciseResources() {
  /** @type {Ref<QuizResource[]>} - List of all channels which have exercises */
  const channels = ref([]);

  /***
   * Question:
   * - Should this module be responsible for only fetching of resources?
   *   - Or should it be purpose-built for navigating the tree such that it has a sort of
   *     "currentTopic" state that it maintains and reactively updates a list of "visible"
   *     resources?
   * - Alternatively -- this could just fetch resources and return them -- basically return a
   *   promise that the component then uses to set its own local state?
   *
   */

  /*
   * - Alternatively -- this could just fetch resources and return them -- basically return a
   *   promise that the component then uses to set its own local state?
   *
   * What does the component usage of this look like then?
   * - fetchChannels -> Promise<QuizResource[]> -- channels only w/ exercises
   * - fetchBookmarks -> Promise<QuizResource[]> -- bookmarks only w/ exercises & topics w/ them
   * - fetchExercisesAndTopics(topicId: string) -> Promise<QuizResource[]>
   * - _getTopicsWithExerciseDescendants(topicIds: string[]) -> Promise<QuizResource[]>
   * - _annotateContentList(contentList: QuizResource[]) -> Promise<QuizResource[]>
   *
   * ResourceSelection.vue
   * - state
   *  - channels: QuizResource[] - A list of all channels that have exercises
   *  - visibleResources: QuizResource[] - A list of resources that are visible in the current view
   *                                       NOTE: -- This would initialize as "channels"
   *  - currentTopicId(): computed -> this.$route.params.topicId -
   *                        The current topic that is being viewed -- route :topicId
   *
   * - onMounted:
   *  - initialize this.channels & this.visibleResources to the return of fetchChannels
   *  - bookmarks too somehow somewhere
   *
   * - onRouteUpdate (or watch currentTopicId?):
   *   - if currentTopicId():
   *      - this.visibleResources set in `then()` of fetchExercisesAndTopics(route.params.topicId)
   *
   */

  /**
   * @returns Promise<QuizResource[]>
   * List of all resources to be displayed
   **/
  function fetchChannelsWithExercises() {
    return ChannelResource.fetchCollection({
      params: { has_exercises: true, available: true },
    }).then(response => {
      return response.map(chnl => {
        return {
          ...chnl,
          id: chnl.root,
          title: chnl.name,
          kind: ContentNodeKinds.CHANNEL,
          is_leaf: false,
        };
      });
    });
  }

  // FIXME -- Be sure we only return bookmarks that are exercises
  /** @returns Promise<QuizResource[]>
   *  List of all bookmarks that are exercises
   **/
  function fetchBookmarksWithExercises() {
    return ContentNodeResource.fetchBookmarks({ params: { limit: 25, available: true } }).then(
      data => {
        return data.results.filter(bookmark => bookmark.kind === 'EXERCISE');
      }
    );
  }

  /** @returns Promise<>
   *  Given a list of topicIds, returns a list of those topics which have exercises somewhere in
   *  their descendants
   **/
  function _getTopicsWithExerciseDescendants(topicIds = []) {
    return new Promise(resolve => {
      if (!topicIds.length) {
        resolve([]);
        return;
      }
      const topicsNumAssessmentDescendantsPromise = ContentNodeResource.fetchDescendantsAssessments(
        topicIds
      );

      topicsNumAssessmentDescendantsPromise.then(response => {
        const topicsWithExerciseDescendants = [];
        response.data.forEach(descendantAssessments => {
          if (descendantAssessments.num_assessments > 0) {
            topicsWithExerciseDescendants.push({
              id: descendantAssessments.id,
              numAssessments: descendantAssessments.num_assessments,
              exercises: [],
            });
          }
        });

        return ContentNodeResource.fetchDescendants(
          topicsWithExerciseDescendants.map(topic => topic.id),
          {
            descendant_kind: ContentNodeKinds.EXERCISE,
          }
        ).then(response => {
          const topicsWithExercises = [];
          response.data.forEach(exercise => {
            topicsWithExercises.push(exercise);
            const topic = topicsWithExerciseDescendants.find(t => t.id === exercise.ancestor_id);
            topic.exercises.push(exercise);
          });
          //channels.value = topicsWithExercises.value;
          resolve(topicsWithExerciseDescendants);
        });
      });
    });
  }

  /** @returns Promise<QuizResource[]> */
  function fetchTopicResources(topicId) {
    const topicNodePromise = ContentNodeResource.fetchModel({ id: topicId });
    const childNodesPromise = ContentNodeResource.fetchCollection({
      getParams: {
        parent: topicId,
        kind_in: [ContentNodeKinds.TOPIC, ContentNodeKinds.EXERCISE],
      },
    });
    const loadRequirements = [topicNodePromise, childNodesPromise];
    console.log('loadRequirements', loadRequirements);

    return Promise.all(loadRequirements).then(([topicNode, childNodes]) => {
      console.log(topicNode, childNodes);
      return _filterAndAnnotateContentList(childNodes).then(contentList => {
        // set(topicId, topicNode.id);
        // ancestors.value = [...topicNode.ancestors, topicNode];
        return {
          contentList,
          ...topicNode,
          thumbnail: getContentNodeThumbnail(topicNode),
        };
      });
    });
  }

  function _filterAndAnnotateContentList(childNodes) {
    return new Promise(resolve => {
      if (childNodes) {
        const childTopics = childNodes.filter(({ kind }) => kind === ContentNodeKinds.TOPIC);
        const topicIds = childTopics.map(({ id }) => id);
        const topicsThatHaveExerciseDescendants = _getTopicsWithExerciseDescendants(topicIds);
        return topicsThatHaveExerciseDescendants.then(topics => {
          const childNodesWithExerciseDescendants = childNodes
            .map(childNode => {
              const index = topics.findIndex(topic => topic.id === childNode.id);
              if (index !== -1) {
                return { ...childNode, ...topics[index] };
              }
              return childNode;
            })
            .filter(childNode => {
              if (
                childNode.kind === ContentNodeKinds.TOPIC &&
                (childNode.numAssessments || 0) < 1
              ) {
                return false;
              }
              return true;
            });
          // TODO -- be sure that we get `exercises` prpoerty from the `topics` thing above
          // that is the list of all exercises within a given topic -- useful for "selecting all"
          // of the topic children when the checkbox is clicked on the topic
          const contentList = childNodesWithExerciseDescendants.map(node => ({
            ...node,
            thumbnail: getContentNodeThumbnail(node),
          }));
          resolve(contentList);
        });
      }
    });
  }

  function showChannelLevel(store, params, query = {}) {
    let kinds;
    if (query.kind) {
      kinds = [query.kind];
    } else {
      kinds = [ContentNodeKinds.EXERCISE, ContentNodeKinds.TOPIC];
    }

    ContentNodeSearchResource.fetchCollection({
      getParams: {
        search: '',
        kind_in: kinds,
        // ...pickBy({ channel_id: query.channel }),
      },
    }).then(results => {
      return _filterAndAnnotateContentList(results.results).then(contentList => {
        const searchResults = {
          ...results,
          results: contentList,
          content_kinds: results.content_kinds.filter(kind =>
            [ContentNodeKinds.TOPIC, ContentNodeKinds.EXERCISE].includes(kind)
          ),
          contentIdsFetched: uniq(results.results.map(({ content_id }) => content_id)),
        };

        this.channels.value = searchResults.results;
        console.log(searchResults.results);
      });
    });
  }

  return {
    fetchChannelsWithExercises,
    fetchTopicResources,
    fetchBookmarksWithExercises,
    showChannelLevel,
  };
}
