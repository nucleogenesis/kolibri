import client from 'kolibri.client';
import Vue from 'vue';
import get from 'lodash/get';

const PARSER = new DOMParser();

const SHUFFLEABLE_INTERACTION_TAGS = ['choiceInteraction'];
const SHUFFLEABLE_CHILDREN_MAP = {
  choiceInteraction: ['simpleChoice'],
};

// TEMP VAR FOR HACKY CONTENT NODE IMPLEMENTATION
// Used to get ref files that are placed in the same folder as the root
const STORAGE_PREFIX = '/content/storage/8/4';

//----------//
// fetching //
// ---------//

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
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

function strToBool(str) {
  console.log(str);
  switch (str.toLowerCase().trim()) {
    case 'true':
    case '1':
      return true;
    case 'false':
    case '0':
    case null:
      return false;
    default:
      return Boolean(str);
  }
}

/** SECOND PASS - MAPPING AND LINKING */
function mappify(dom, commit) {
  // NOTE: dom[0] refers to the root <assessmentTest> element
  // Get testParts. These are mutiplicity [1..n]
  const testPartElements = Array.from(dom[0].getElementsByTagName('testPart'));
  const testParts = testPartElements.map(e => e.attributes['identifier'].value);
  const testPartsMap = mapTestParts(testPartElements);

  // Get all assessmentSections
  const assessmentSectionElements = Array.from(dom[0].getElementsByTagName('assessmentSection'));

  // Get the items now
  const assessmentItemElements = Array.from(dom[0].getElementsByTagName('assessmentItem'));

  let assessmentSectionsMap = mapAssessmentSections(assessmentSectionElements);
  let assessmentItemsMap = mapAssessmentItems(assessmentItemElements);

  const firstTestPart = testPartsMap[testParts[0]];

  // Need a function to recursively find the next section that has items.
  // That is the "first section"... that we care about. A wrapping outer
  // section may exist, but it is irrelevant right
  function findNextSectionWithItems(sectionId) {
    const section = assessmentSectionsMap[sectionId];
    if (get(section, 'assessmentItems', []).length > 0) {
      return section;
    } else {
      if (get(section, 'assessmentSections', []).length > 0) {
        return findNextSectionWithItems(section.assessmentSections[0]);
      } else {
        console.warn('XML has no assessment items.');
      }
    }
  }
  console.log(dom);
  const firstAssessmentSection = findNextSectionWithItems(firstTestPart.assessmentSections[0]);
  const firstAssessmentItem = assessmentItemsMap[firstAssessmentSection.assessmentItems[0]];

  const initialState = {
    dom: dom[0],
    testParts,
    testPartsMap,
    assessmentSectionsMap,
    assessmentItemsMap,
    testResponses: {},
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

  commit('INITIALIZE', initialState);
}

function mapTestParts(elements) {
  return elements.reduce((obj, elem, idx) => {
    const identifier = elem.attributes['identifier'].value;
    const navigationMode = elem.attributes['navigationMode'].value;
    const submissionMode = elem.attributes['submissionMode'].value;

    // Get the assessmentSections that are direct children
    const assessmentSections = Array.from(elem.children)
      // Can get both section and refs because we just want the ID in the right order
      .filter(child => child.tagName === 'assessmentSection')
      .map(sec => sec.attributes['identifier'].value);

    console.log(assessmentSections);
    console.log(Array.from(elem.children));

    obj[identifier] = {
      identifier,
      assessmentSections,
      navigationMode,
      submissionMode,
    };

    return obj;
  }, {});
}

function mapAssessmentSections(elements) {
  return elements.reduce((obj, elem, idx) => {
    const identifier = elem.attributes['identifier'].value;
    const title = elem.attributes['title'].value;
    const fixed = elem.attributes['fixed'].value;
    const visible = elem.attributes['visible'].value;

    // <ordering shuffle=<bool>/> child element determines whether we shuffle children
    const orderingElem = Array.from(elem.children).filter(e => e.tagName === 'ordering');
    const shuffle = orderingElem.length
      ? strToBool(get(orderingElem[0], 'attributes.shuffle').value)
      : false;

    const assessmentSections = Array.from(elem.children)
      .filter(child => ['assessmentSection', 'assessmentSectionRef'].includes(child.tagName))
      .map(e => e.attributes['identifier'].value);

    const assessmentItems = Array.from(elem.children)
      .filter(child => ['assessmentItem', 'assessmentItemRef'].includes(child.tagName))
      .map(e => e.attributes['identifier'].value);

    obj[identifier] = {
      identifier,
      title,
      fixed,
      visible,
      shuffle,
      assessmentSections,
      assessmentItems,
    };

    return obj;
  }, {});
}

function mapAssessmentItems(elements) {
  return elements.reduce((obj, elem, idx) => {
    const identifier = elem.attributes['identifier'].value;
    const title = elem.attributes['title'].value;
    const adaptive = elem.attributes['adaptive'].value;
    const timeDependent = elem.attributes['timeDependent'].value;
    const itemBody = Array.from(elem.children).find(e => e.tagName === 'itemBody');
    // Can have 0+ repsonse declaration elements
    const responseDeclarationsElements = Array.from(elem.children).filter(
      e => e.tagName === 'responseDeclaration'
    );
    const outcomeDeclarationsElements = Array.from(elem.children).filter(
      e => e.tagName === 'outcomeDeclaration'
    );
    const stylesheetElements = Array.from(elem.children).filter(e => e.tagName === 'stylesheet');
    const modalFeedbackElements = Array.from(elem.children).filter(
      e => e.tagName === 'modalFeedback'
    );

    obj[identifier] = {
      identifier,
      title,
      adaptive,
      timeDependent,
      itemBody,
      responseDeclarationsElements,
      outcomeDeclarationsElements,
      stylesheetElements,
      modalFeedbackElements,
    };

    return obj;
  }, {});
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
      responseDeclaration: objectifyResponseDeclaration(responseDeclaration),
      outcomeDeclaration,
      itemBody: objectifyItemBody(itemBody),
      stylesheet,
      responseProcessing,
      title,
      order: idx,
      element: item,
    };
    return obj;
  }, {});
}

function objectifyItemBody(itemBody) {
  // Should only be one interaction per itemBody
  const interaction = Array.from(itemBody.children).filter(e =>
    SHUFFLEABLE_INTERACTION_TAGS.includes(e.tagName)
  )[0];

  const shuffleableElements = Array.from(interaction.children).filter(c => {
    return SHUFFLEABLE_CHILDREN_MAP[interaction.tagName].includes(c.tagName);
  });
  const fixedIndices = shuffleableElements.map(c => c.attributes.getNamedItem('fixed'));
  const shuffledItems = shuffleArray(
    shuffleableElements.filter(e => !e.attributes.getNamedItem('fixed'))
  );
  const shuffledWithFixedItems = fixedIndices.map((isFixed, idx) => {
    if (isFixed) {
      return shuffleableElements[idx];
    } else {
      return shuffledItems.pop();
    }
  });

  /*
  const shuffledInteractableElements = Array.from(itemBody.children).reduce((obj, element) => {
    if (SHUFFLEABLE_INTERACTION_TAGS.includes(element.tagName)) {
      const shuffleableElements = Array.from(element.children).filter(
        e => e.tagName === SHUFFLEABLE_CHILDREN_MAP[element.tagName]
      );
      // Either null or 'fixed' values mapped here treat 'fixed' as boolean true.
      // Basically we track the position of the "fixed" items so we can plug them in later
      const fixedIndices = shuffleableElements.map(c => c.attributes.getNamedItem('fixed'));
      // Exclude items with the "fixed" value from those which we shuffle.
      const shuffledItems = shuffleArray(
        shuffleableElements.filter(e => !e.attributes.getNamedItem('fixed'))
      );
      const shuffledWithFixedItems = fixedIndices.map((isFixed, idx) => {
        if (isFixed) {
          // This index should be the "fixed" option so we plug that one in
          return shuffleableElements[idx];
        } else {
          // Just grab one of the shuffled items and map it in.
          return shuffledItems.pop();
        }
      });
    }
  }, []);
  */

  return {
    element: itemBody,
    cardinality: interaction.getAttribute('cardinality'),
    maxChoices: interaction.getAttribute('maxChoices'),
    responseIdentifier: interaction.getAttribute('responseIdentifier'),
    responseOptions: shuffledWithFixedItems,
  };
}

function objectifyResponseDeclaration(items) {
  const correctResponse = getChildByTag(items[0], 'correctResponse');
  const valueNode = getChildByTag(correctResponse, 'value');
  if (valueNode) {
    return { correctResponseIdentifier: valueNode.textContent };
  } else {
    return { correctResponseIdentifier: null };
  }
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
    testPartsMap: {},
    assessmentSectionsMap: {},
    assessmentItemsMap: {},
    testParts: {},
    testResponses: {},
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
    initialize({ commit }, payload) {
      mappify(payload, commit);
    },
    /*
    nextAssessmentItem({ commit, getters, state }) {
      const currentProgress = Object.assign({}, state.testProgress);
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

      const part = state.testParts[targetHistory.testPart];
      const section = part.assessmentSections[targetHistory.assessmentSection];
      const item = section.assessmentItems[targetHistory.assessmentItem];
      commit('SET_CURRENT_TEST_PROGRESS', { part, section, item });
      commit('GO_BACK_IN_HISTORY');
    },
    processResponse({ commit, getters }, payload) {
      const itemIdentifier = getters.currentAssessmentItem.identifier;
      commit('UPDATE_RESPONSE', {
        itemIdentifier,
        value: payload,
      });
    },
    */
  },
  mutations: {
    INITIALIZE(state, payload) {
      Object.assign(state, payload);
    },
    RESET_STATE(state) {
      Object.assign(state, DEFUALT_STATE);
    },
    SET_ASSESSMENT_ITEM(state, payload) {
      Vue.set(state.testProgress, 'assessmentItem', payload);
    },
    SET_ASSESSMENT_SECTION(state, payload) {
      Vue.set(state.testProgress, 'assessmentSection', payload);
    },
    SET_TEST_PART(state, payload) {
      Vue.set(state.testProgress, 'testPart', payload);
    },
    // Expects to receive {part, section, item} objects
    SET_CURRENT_TEST_PROGRESS(state, payload) {
      const newProgress = {
        testPart: payload.part,
        assessmentSection: payload.section,
        assessmentItem: payload.item,
      };
      Vue.set(state, 'testProgress', newProgress);
    },
    ADD_NEW_HISTORY(state, payload) {
      const history = Array.from(state.testProgressHistory);
      history.push(payload);
      state.testProgressHistory = history;
    },
    GO_BACK_IN_HISTORY(state) {
      // If the length is 1 then we're on the first question, can't go back
      if (state.testProgressHistory.length > 1) {
        state.testProgressHistory = [
          ...state.testProgressHistory.slice(0, state.testProgressHistory.length - 1),
        ];
      }
    },
    UPDATE_RESPONSE(state, payload) {
      state.testResponses = { ...state.testResponses, [payload.itemIdentifier]: payload.value };
    },
  },
  getters: {
    currentAssessmentItem(state) {
      if (!state.initialized) return {};
      return state.testProgress.assessmentItem;
    },
    responseForCurrentItem(state, getters) {
      return state.testResponses[getters.currentAssessmentItem.identifier];
    },
    /*
    currentTestPart(state) {
      if (!state.initialized) return {};
      const testPart = state.testPartsMap[state.testProgress.testPart.identifier];
      return testPart || {};
    },
    currentAssessmentSection(state, getters) {
      if (!state.initialized) return {};
      return (
        getters.currentTestPart.assessmentSectionsMap[
          state.testProgress.assessmentSection.identifier
        ] || {}
      );
    },
    currentAssessmentItem(state, getters) {
      if (!state.initialized) return {};
      return (
        getters.currentAssessmentSection.assessmentItemsMap[
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
    },
    responseForCurrentItem(state, getters) {
      return state.testResponses[getters.currentAssessmentItem.identifier];
    },
    */
  },
};
