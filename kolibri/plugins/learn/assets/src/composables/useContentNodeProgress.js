/**
 * A composable function containing logic related to learner's
 * progress through resources
 * All data exposed by this function belong to a current learner.
 */

import { reactive } from 'kolibri.lib.vueCompositionApi';
import { set } from '@vueuse/core';

import { ContentNodeProgressResource } from 'kolibri.resources';

// The reactive is defined in the outer scope so it can be used as a shared store
const contentNodeProgressMap = reactive({});

export default function useContentNodeProgress() {
  /**
   * Fetches content node progress data
   * and saves data to this composable's store
   *
   * @param {Object} getParams Parameters to filter by, should be the same as
   * the contentnodes fetched that we want the progress for.
   * @returns {Promise}
   * @public
   */
  function fetchContentNodeProgress(getParams) {
    return ContentNodeProgressResource.fetchCollection({
      getParams,
      force: true,
    }).then(progressData => {
      const progresses = progressData ? progressData : [];
      for (let progress of progresses) {
        set(contentNodeProgressMap, progress.content_id, progress.progress);
      }
    });
  }

  /**
   * Fetches content node progress data
   * and saves data to this composable's store
   *
   * @param {Object} getParams Parameters to filter by, should be the same as
   * the contentnodes fetched that we want the progress for.
   * @returns {Promise}
   * @public
   */
  function fetchContentNodeTreeProgress({ id, params }) {
    return ContentNodeProgressResource.fetchTree({
      params,
      id,
    }).then(progressData => {
      const progresses = progressData ? progressData : [];
      for (let progress of progresses) {
        set(contentNodeProgressMap, progress.content_id, progress.progress);
      }
    });
  }

  return {
    fetchContentNodeProgress,
    fetchContentNodeTreeProgress,
    contentNodeProgressMap,
  };
}