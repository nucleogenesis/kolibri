import { createTranslator } from 'kolibri.utils.i18n';

export const enhancedQuizManagementStrings = createTranslator('EnhancedQuizManagementStrings', {
  selectAllLabel: {
    message: 'Select all',
  },
  sectionLabel: {
    message: 'Section { sectionNumber, number }',
  },
  createNewQuiz: {
    message: 'Create new quiz',
  },
  quizSectionsLabel: {
    message: 'Quiz sections',
    context: 'Used as an aria-label for screen readers to describe the purpose of the list of tabs',
  },
  quizTitle: {
    message: 'Quiz title',
  },
  addQuizSections: {
    message: 'Add one or more sections to the quiz, according to your needs',
  },
  addSectionLabel: {
    message: 'Add section',
  },
  editSectionLabel: {
    message: 'Edit section',
  },
  deleteSectionLabel: {
    message: 'Delete section',
  },
  noQuestionsInSection: {
    message: 'There are no questions in this section',
  },
  addQuizSectionQuestionsInstructions: {
    message: 'To add questions, select resources from the available channels',
  },
  addQuestionsLabel: {
    message: 'Add questions',
  },
  addMoreQuestionsLabel: {
    message: 'Add more questions',
  },
  sectionSettings: {
    message: 'Section settings',
  },
  sectionTitle: {
    message: 'Section title',
  },
  sectionTitleUniqueWarning: {
    message: 'Section titles must be unique within the quiz',
    context: 'Informs the user that they must use a unique title for each section',
  },
  numberOfQuestionsLabel: {
    message: 'Number of questions',
  },
  optionalDescriptionLabel: {
    message: 'Description (optional)',
  },
  selectResources: {
    message: 'Select resources',
  },
  sectionOrder: {
    message: 'Section order',
  },
  currentSection: {
    message: 'Current section',
  },
  applySettings: {
    message: 'Apply settings',
  },
  addQuestions: {
    message: 'Add questions',
  },
  addNumberOfQuestions: {
    message: 'Add { count, number } { count, plural, one { question } other { questions }}',
  },
  selectResourcesDescription: {
    message: 'Select resources to add questions to this section',
  },
  numberOfSelectedBookmarks: {
    message: '{ count, number } { count, plural, one { bookmark } other { bookmarks }}',
  },
  numberOfSelectedQuestions: {
    message: '{count, number} {count, plural, one {question selected} other {questions selected}}',
  },
  maxNumberOfQuestions: {
    message: 'Max { count, number } { count, plural, one { question } other { questions }}',
  },
  maxNumberOfQuestionsPerSection: {
    message:
      'Each section may only contain up to { count, number } { count, plural, one { question} other { questions}}, this section has { current, number }',
  },
  replaceQuestions: {
    message: 'Replace questions',
  },
  changeResources: {
    message: 'Change resources',
  },
  questionList: {
    message: 'Question list',
  },
  addAnswer: {
    message: 'Add answer',
  },
  collapseAll: {
    message: 'Collapse all',
  },
  expandAll: {
    message: 'Expand all',
  },
  replaceAction: {
    message: 'Replace',
  },
  replaceQuestionsHeading: {
    message: 'The new questions you select will replace the current ones.',
  },
  replaceQuestionsExplaination: {
    message: 'The new questions you selected will replace the current ones.',
  },
  noUndoWarning: {
    message: "You can't undo or cancel this.",
  },
  resourceMismatchWarning: {
    message: 'The resource you chose does not match the number of questions you want to replace.',
  },
  resourceMismatchDirection: {
    message:
      'Please choose a different resource or decrease the number of questions to be replaced.',
  },
  sectionOrderLabel: {
    message: 'Section order',
    context: 'A label for the place where the section order option is shown.',
  },
  questionOrder: {
    message: 'Question order',
  },
  randomizedLabel: {
    message: 'Randomized',
  },
  selectFromBookmarks: {
    message: 'Select from bookmarks',
  },
  randomizedOptionDescription: {
    message: 'Each learner sees a different question order',
  },
  randomizedSectionOptionDescription: {
    message: 'Each learner sees a different section order',
  },
  fixedLabel: {
    message: 'Fixed',
  },
  fixedOptionDescription: {
    message: 'Each learner sees the same question order',
  },
  fixedSectionOptionDescription: {
    message: 'Each learner sees the same section order',
  },
  questionEditedSuccessfully: {
    message: 'Question edited successfully',
  },
  reviewSelectedResources: {
    message: 'Review selected resources',
  },
  deleteConfirmation: {
    message: "Are you sure you want to delete section '{section_title}'?",
    context:
      'A warning message that appears when the user tries to leave the page without saving their work',
  },
  closeConfirmationTitle: {
    message: 'Are you sure you want to leave this page?',
    context:
      'The title of a confirmation modal informing the user that they will lose their work if they leave the page',
  },
  closeConfirmationMessage: {
    message: 'You will lose any unsaved edits to your work',
    context:
      'The body of a confirmation modal informing the user that they will lose their work if they leave the page',
  },

  numberOfSelectedReplacements: {
    message:
      '{ count, number } of { total, number } {total, plural, one {replacement selected} other {replacements selected}}',
  },
  numberOfQuestionsReplaced: {
    message:
      '{ count, number } { count, plural, one { question successfully replaced } other { questions successfully replaced }} ',
  },
  numberOfQuestionsSelected: {
    message: '{count, number} {count, plural, one {question selected} other {questions selected}}',
  },
  numberOfResourcesSelected: {
    message: '{count, number} {count, plural, one {resource selected} other {resources selected}}',
  },
  selectedQuestionsInformation: {
    message:
      '{count, number, integer} of {total, number, integer} {total, plural, one {question selected} other {questions selected}}',
  },
  selectMoreQuestion: {
    message:
      'Select { count } more { count, plural , one { question } other { questions }} to continue',
  },
  selectFewerQuestion: {
    message:
      'Select { count } fewer { count, plural ,one { question } other { questions }} to continue',
  },
  selectQuiz: {
    message: 'Select quiz',
    context:
      "Practice quizzes are pre-made quizzes, that don't require the curation work on the part of the coach. Selecting a practice quiz refers to importing a ready-to-use quiz.",
  },
  selectPracticeQuizLabel: {
    message: 'Select a practice quiz',
    context:
      "Practice quizzes are pre-made quizzes, that don't require the curation work on the part of the coach. Selecting a practice quiz refers to importing a ready-to-use quiz.",
  },
  cannotSelectSomeTopicWarning: {
    message:
      'You can only select folders with { count, number } or less exercises and no subfolders to avoid oversized quizzes.',
  },
  changesSavedSuccessfully: {
    message: 'Changes saved successfully',
    context: 'A snackbar message that appears when the user saves their changes',
  },
  sectionDeletedNotification: {
    message: "Section '{ section_title }' deleted",
    context: 'A snackbar message that appears when the user deletes a section',
  },
  questionsDeletedNotification: {
    message: '{ count, number } { count, plural, one { question } other { questions }} deleted',
    context: 'A snackbar message that appears when the user deletes questions',
  },
  updateResources: {
    message: 'Update resources',
  },
  allSectionsEmptyWarning: {
    message: "You don't have any questions in the quiz",
  },
  notEnoughReplacementsTitle: {
    message: 'Not enough replacements available',
    context:
      'Title of modal when a user tries to replace more questions than are available in the pool',
  },
  noReplacementsMessage: {
    message:
      'There are no more similar questions available to replace the selected questions with.',
  },
  notEnoughReplacementsMessage: {
    message:
      "You've selected { selected, number } { selected, plural, one { question } other { questions } } to replace, but {available, plural, =0 { don't have questions } one { only have 1 question } other { only have { available } questions } } available to replace them with.",
    context:
      'Message of modal when a user tries to replace more questions than are available in the pool',
  },
  editRecipients: {
    message: 'Edit recipients',
  },
  addMoreQuestionsWithEmptyPool: {
    message: 'You can add more questions, or delete existing questions.',
    context: 'Message of modal when a user tries to replace questions but the pool is empty',
  },
  addMoreQuestionsWithNonEmptyPool: {
    message:
      'You can go back and select { count, number } { count, plural, one { question } other { questions or fewer }} to replace.',
    context:
      'Message of modal when a user tries to replace more questions than are available in the pool',
  },
  addResourcesAction: {
    message: 'Add resources',
  },
  goBackAction: {
    message: 'Go back',
  },
  questionsUnusedInSection: {
    message: '{ count, number } { count, plural, one { question } other { questions }} unused',
  },
  questionsFromResources: {
    message:
      '{ questions, number } { questions, plural, one { question } other { questions }} in { resources, number } { resources, plural, one { resource } other { resources }}',
  },
  questionsLabel: {
    message: 'Questions',
    context: 'Label for dropdown list of questions',
  },
  saveAndClose: {
    message: 'Save and close',
  },
  questionDeletionConfirmation: {
    message:
      'Are you sure you want to remove { count, number } { count, plural, one { question } other { questions }} from this section?',
  },
});

const { sectionLabel$ } = enhancedQuizManagementStrings;

export function displaySectionTitle(section, index) {
  return section.section_title === ''
    ? sectionLabel$({ sectionNumber: index + 1 })
    : section.section_title;
}

export function displayQuestionTitle(question, exerciseTitle) {
  return question.title === ''
    ? `${exerciseTitle} (${enhancedQuizManagementStrings.$formatNumber(
        question.counter_in_exercise
      )})`
    : question.title;
}
