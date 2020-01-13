import client from 'kolibri.client';

const PARSER = new DOMParser();

//----------//
// fetching //
// ---------//

function urlFromHash(filename) {
  return `${filename[0]}/${filename[1]}/${filename}`;
}

function fetchAssessmentItemRef(item) {
  const path = urlFromHash(item.attributes['href'].value);
  const method = 'GET';
  return client({ path, method });
}

//----------//
// obsolete getters for elements most likely //
// ---------//

// Return children one level deep.
// Not found return []
function getChildrenByTag(collection, tag) {
  return Array.from(collection.children).filter(e => e.tagName === tag);
}

// Return first child one level deep or null
function getChildByTag(collection, tag) {
  return Array.from(collection.children).find(e => e.tagName === tag);
}

//------------
// helpers
//------------

function convertInitialPayloadToState(dom) {
  // NOTE: dom[0] refers to the root <assessmentTest> element
  // Get testParts. These are mutiplicity [1..n]
  const testPartElements = Array.from(dom[0].getElementsByTagName('testPart'));

  // From the testParts we can get all assessmentSections(Refs) and
  // assessmentItems(Refs) and build an easy-to-use object for the state.
  const testParts = objectifyTestParts(testPartElements);
  // IMPLEMENT SHUFFLE HERE?
  // REFACTOR ENTIRE DATA STRUCTURE?
  // CONSIDER ALL OPTIONS
  // TODO: Reconsider the data structure!

  const firstTestPartIdentifier = Object.keys(testParts).find(k => testParts[k].order === 0);
  const firstTestPart = testParts[firstTestPartIdentifier];

  const firstAssessmentSectionIdentifier = Object.keys(firstTestPart.assessmentSections).find(
    k => firstTestPart.assessmentSections[k].order === 0
  );
  const firstAssessmentSection = firstTestPart.assessmentSections[firstAssessmentSectionIdentifier];

  const firstAssessmentItemIdentifier = Object.keys(firstAssessmentSection.assessmentItems).find(
    k => firstAssessmentSection.assessmentItems[k].order === 0
  );
  const firstAssessmentItem = firstAssessmentSection.assessmentItems[firstAssessmentItemIdentifier];

  return {
    dom: dom[0],
    testParts,
    testProgress: {
      testPart: firstTestPart,
      assessmentSection: firstAssessmentSection,
      assessmentItem: firstAssessmentItem,
    },
    testProgressHistory: [
      {
        testPart: firstTestPart.identifier,
        assessmentSection: firstAssessmentSection.identifier,
        assessmentItem: firstAssessmentItem.identifier,
      },
    ],
    initialized: true,
  };
}

/**
 *
 * @param {Array} items
 * @returns {object}
 * {
 *  testParts: {
 *    [testPartIdentifier]: {
 *      assessmentSections: {
 *        [assessmentSectionId]: {
 *          assessmentItems: {
 *            [assessmentItemId]: {
 *              identifier, responseDeclaration, outcomeDeclaration,
 *              itemBody, stylesheet, responseProcessing,
 *            }
 *          }
 *       }
 *     }
 *   }
 *  }
 * }
 */
function objectifyTestParts(items) {
  return items.reduce((obj, item, idx) => {
    const testPartIdentifier = item.attributes['identifier'].value;

    const assessmentSections = Array.from(item.getElementsByTagName('assessmentSection')).concat(
      Array.from(item.getElementsByTagName('assessmentSectionRef'))
    );

    obj[testPartIdentifier] = {
      identifier: testPartIdentifier,
      assessmentSections: objectifyAssessmentSections(assessmentSections),
      element: item,
      order: idx,
    };
    return obj;
  }, {});
}

function objectifyAssessmentSections(items) {
  return items.reduce((obj, item, idx) => {
    // Fetch ref file if necessary
    if (item.tagName.includes('Ref')) {
      item = fetchRef(item.attributes.href.value).then(({ entity }) => {
        item = PARSER.parseFromString(entity, 'text/xml');
      });
    }
    const assessmentSectionIdentifier = item.attributes['identifier'].value;

    const assessmentItems = Array.from(item.getElementsByTagName('assessmentItem')).concat(
      Array.from(item.getElementsByTagName('assessmentItemRef'))
    );
    const title = item.attributes.hasOwnProperty('title') ? item.attributes.title.value : '';

    obj[assessmentSectionIdentifier] = {
      identifier: assessmentSectionIdentifier,
      assessmentItems: objectifyAssessmentItems(assessmentItems),
      element: item,
      order: idx,
      title,
    };
    return obj;
  }, {});
}

function objectifyAssessmentItems(items) {
  return items.reduce((obj, item, idx) => {
    // Fetch Ref File if necessary
    if (item.tagName.includes('Ref')) {
      fetchAssessmentItemRef(item.attributes.href.value).then(({ entity }) => {
        item = PARSER.parseFromString(entity, 'text/xml');
      });
    }
    const identifier = item.attributes.identifier.value;
    // There can be any number of response and outcome declarations
    const responseDeclaration = getChildrenByTag(item, 'responseDeclaration');
    const outcomeDeclaration = getChildrenByTag(item, 'outcomeDeclaration');
    // The following can only have 0 or 1 tag
    const itemBody = getChildByTag(item, 'itemBody');
    const stylesheet = getChildByTag(item, 'stylesheet');
    const responseProcessing = getChildByTag(item, 'responseProcessing');
    const title = item.attributes.hasOwnProperty('title') ? item.attributes.title.value : '';

    obj[identifier] = {
      identifier,
      responseDeclaration,
      outcomeDeclaration,
      itemBody,
      stylesheet,
      responseProcessing,
      title,
      order: idx,
      element: item,
    };
    return obj;
  }, {});
}

const DEFUALT_STATE = {
  dom: null,
  testParts: {},
};

export default {
  namespaced: true,
  state: {
    initialized: false,
    dom: null,
    testParts: {},
    // Each value indicates the identifier of the current node
    testProgress: {
      testPart: {},
      assessmentSection: {},
      assessmentItem: {},
    },
    // Tracks an array of the order in which items were shown
    testProgressHistory: [],
    userCanGoBack: true,
  },
  actions: {
    nextAssessmentItem({ commit, getters, state }) {
      const currentProgress = Object.assign({}, state.testProgressHistory);
      // If this isn't the last item in the current section, we bump it and move along
      if (!getters.currentItemIsLastItem) {
        const nextItemKey = Object.keys(getters.currentAssessmentSection.assessmentItems).find(
          k =>
            getters.currentAssessmentSection.assessmentItems[k].order ===
            state.testProgress.assessmentItem.order + 1
        );
        const nextItem = getters.currentAssessmentSection.assessmentItems[nextItemKey];
        currentProgress.assessmentItem = nextItemKey;
        commit('SET_ASSESSMENT_ITEM', nextItem);
        commit('ADD_NEW_HISTORY', currentProgress);
        return;
      }
      // Now we know we've hit the last item in the current section.
      // If this isn't the last section, we bump the section and set the Item to it's order 0 item.
      if (!getters.currentSectionIsLastSection) {
        const nextSessionKey = Object.keys(getters.currentTestPart.assessmentSections).find(
          k =>
            getters.currentTestPart.assessmentSections[k].order ===
            state.testProgress.assessmentSection.order + 1
        );
        const nextSession = getters.currentTestPart.assessmentSections[nextSessionKey];
        commit('SET_ASSESSMENT_SECTION', nextSession);

        const nextItemKey = Object.keys(nextSession.assessmentItems).find(
          k => nextSession.assessmentItems[k].order === 0
        );
        const nextItem = nextSession.assessmentItems[nextItemKey];
        currentProgress.assessmentSection = nextSessionKey;
        currentProgress.assessmentItem = nextItemKey;
        commit('SET_ASSESSMENT_ITEM', nextItem);
        commit('ADD_NEW_HISTORY', currentProgress);
        return;
      }
      // Now we've finished the current session and the current part - lets see if we have another.
      // If we do - move along to the next part, section and item.
      if (!getters.currentPartIsLastPart) {
        const nextPartKey = Object.keys(state.testParts).find(
          k => state.testParts[k].order === getters.currentTestPart.order + 1
        );
        const nextPart = state.testParts[nextPartKey];
        commit('SET_TEST_PART', nextPart);

        const nextSessionKey = Object.keys(nextPart.assessmentSections).find(
          k => nextPart.assessmentSections[k].order === 0
        );
        const nextSession = nextPart.assessmentSections[nextSessionKey];
        commit('SET_ASSESSMENT_SECTION', nextSession);

        const nextItemKey = Object.keys(nextSession.assessmentItems).find(
          k => nextSession.assessmentItems[k].order === 0
        );
        const nextItem = nextSession.assessmentItems[nextItemKey];

        currentProgress.testPart = nextPartKey;
        currentProgress.assessmentSection = nextSessionKey;
        currentProgress.assessmentItem = nextItemKey;

        commit('SET_ASSESSMENT_ITEM', nextItem);
        commit('ADD_NEW_HISTORY', currentProgress);
        return;
      }
    },
    // Sets the current progress to the newest item in the testProgressHistory
    // and removes that entry from testProgressHistory
    previousAssessmentItem({ commit, state, getters }) {
      if (getters.onFirstQuestion) {
        // Can't go back when on the first question
        return;
      }
      const targetHistory = state.testProgressHistory[state.testProgressHistory.length - 2];

      console.log(targetHistory);

      const part = state.testParts[targetHistory.testPart];
      const section = part.assessmentSections[targetHistory.assessmentSection];
      const item = section.assessmentItems[targetHistory.assessmentItem];
      commit('SET_CURRENT_TEST_PROGRESS', { part, section, item });
      commit('GO_BACK_IN_HISTORY');
    },
  },
  mutations: {
    INITIALIZE(state, payload) {
      Object.assign(state, convertInitialPayloadToState(payload));
    },
    RESET_STATE(state) {
      Object.assign(state, DEFUALT_STATE);
    },
    SET_ASSESSMENT_ITEM(state, payload) {
      state.testProgress.assessmentItem = payload;
    },
    SET_ASSESSMENT_SECTION(state, payload) {
      state.testProgress.assessmentSection = payload;
    },
    SET_TEST_PART(state, payload) {
      state.testProgress.testPart = payload;
    },
    // Expects to receive {part, section, item} objects
    SET_CURRENT_TEST_PROGRESS(state, payload) {
      state.testProgress = Object.assign(
        {},
        {
          testPart: payload.part,
          assessmentSection: payload.section,
          assessmentItem: payload.item,
        }
      );
    },
    ADD_NEW_HISTORY(state, payload) {
      const history = Array.from(state.testProgressHistory);
      history.push(payload);
      state.testProgressHistory = history;
    },
    GO_BACK_IN_HISTORY(state) {
      // If the length is 1 then we're on the first question, can't go back
      if (state.testProgressHistory.length > 1) {
        state.testProgressHistory = state.testProgressHistory.slice(
          0,
          state.testProgressHistory.length - 1
        );
      }
    },
  },
  getters: {
    currentTestPart(state) {
      if (!state.initialized) return {};
      const testPart = state.testParts[state.testProgress.testPart.identifier];
      return testPart || {};
    },
    currentAssessmentSection(state, getters) {
      if (!state.initialized) return {};
      return (
        getters.currentTestPart.assessmentSections[
          state.testProgress.assessmentSection.identifier
        ] || {}
      );
    },
    currentAssessmentItem(state, getters) {
      if (!state.initialized) return {};
      return (
        getters.currentAssessmentSection.assessmentItems[
          state.testProgress.assessmentItem.identifier
        ] || {}
      );
    },
    currentItemIsLastItem(state, getters) {
      if (!state.initialized) return {};
      return (
        getters.currentAssessmentItem.order ===
        Object.keys(getters.currentAssessmentSection.assessmentItems).length - 1
      );
    },
    currentSectionIsLastSection(state, getters) {
      if (!state.initialized) return {};
      return (
        getters.currentAssessmentSection.order ===
        Object.keys(getters.currentTestPart.assessmentSections).length - 1
      );
    },
    currentPartIsLastPart(state, getters) {
      if (!state.initialized) return {};
      return getters.currentTestPart.order === Object.keys(state.testParts).length - 1;
    },
    onFirstQuestion(state) {
      return state.testProgressHistory.length === 1;
    }
  },
};

/**
 * what I need to be able to do:
 *
 * - SET the state of the quiz to a specific test part, test section, or test item
 * - GET the __NEXT__ item where the order is followed as expected.
 */
