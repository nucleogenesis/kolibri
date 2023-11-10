import { LessonsPageNames } from './lessonsConstants';

export const PageNames = {
  HOME_PAGE: 'HomePage', // make sure this matches the Coach 'Home' page name
  REPORTS_PAGE: 'REPORTS_PAGE',
  PLAN_PAGE: 'PLAN_PAGE',
  COACH_CLASS_LIST_PAGE: 'COACH_CLASS_LIST_PAGE',
  NEW_COACH_PAGES: 'NEW_COACH_PAGES',
  EXAMS: 'EXAMS',
  EXAM_CREATION_ROOT: 'EXAM_CREATION_ROOT',
  EXAM_CREATION_PRACTICE_QUIZ: 'EXAM_CREATION_PRACTICE_QUIZ',
  EXAM_CREATION_SELECT_PRACTICE_QUIZ_TOPIC: 'EXAM_CREATION_SELECT_PRACTICE_QUIZ_TOPIC',
  EXAM_CREATION_PRACTICE_QUIZ_PREVIEW: 'EXAM_CREATION_PRACTICE_QUIZ_PREVIEW',

  /** Newly added routes */
  QUIZ_SECTION_EDITOR: 'QUIZ_SECTION_EDITOR',
  QUIZ_REPLACE_QUESTIONS: 'QUIZ_REPLACE_QUESTIONS',
  QUIZ_SELECT_RESOURCES: 'QUIZ_SELECT_RESOURCES',
  SELECT_FROM_RESOURCE:'SELECT_FROM_RESOURCE',

  /** TODO Remove unused */
  EXAM_CREATION_TOPIC: 'EXAM_CREATION_TOPIC',
  EXAM_CREATION_BOOKMARKS: 'EXAM_CREATION_BOOKMARKS',
  EXAM_CREATION_BOOKMARKS_MAIN: 'EXAM_CREATION_BOOKMARKS_MAIN',
  EXAM_CREATION_PREVIEW: 'EXAM_CREATION_PREVIEW',
  EXAM_CREATION_SEARCH: 'EXAM_CREATION_SEARCH',
  EXAM_CREATION_QUESTION_SELECTION: 'EXAM_CREATION_QUESTION_SELECTION',
  EXAM_PREVIEW: 'EXAM_PREVIEW',
  EXAM_REPORT: 'EXAM_REPORT',
  EXAM_REPORT_DETAIL: 'EXAM_REPORT_DETAIL',
  EXAM_REPORT_DETAIL_ROOT: 'EXAM_REPORT_DETAIL_ROOT',
  REPORTS_LESSON_EXERCISE_LEARNER_PAGE_ROOT: 'REPORTS_LESSON_EXERCISE_LEARNER_PAGE_ROOT',
  REPORTS_GROUP_REPORT_LESSON_EXERCISE_LEARNER_PAGE_ROOT:
    'REPORTS_GROUP_REPORT_LESSON_EXERCISE_LEARNER_PAGE_ROOT',
  REPORTS_LEARNER_ACTIVITY_EXERCISE_PAGE_ROOT: 'REPORTS_LEARNER_ACTIVITY_EXERCISE_PAGE_ROOT',
  REPORTS_LEARNER_REPORT_LESSON_EXERCISE_PAGE_ROOT:
    'REPORTS_LEARNER_REPORT_LESSON_EXERCISE_PAGE_ROOT',
  REPORTS_LESSON_LEARNER_EXERCISE_PAGE_ROOT: 'REPORTS_LESSON_LEARNER_EXERCISE_PAGE_ROOT',
  REPORTS_GROUP_LEARNER_REPORT_QUIZ_PAGE_ROOT: 'REPORTS_GROUP_LEARNER_REPORT_QUIZ_PAGE_ROOT',
  REPORTS_GROUP_REPORT_QUIZ_LEARNER_PAGE_ROOT: 'REPORTS_GROUP_REPORT_QUIZ_LEARNER_PAGE_ROOT',
  REPORTS_LEARNER_REPORT_QUIZ_PAGE_ROOT: 'REPORTS_LEARNER_REPORT_QUIZ_PAGE_ROOT',
  REPORTS_QUIZ_LEARNER_PAGE_ROOT: 'REPORTS_QUIZ_LEARNER_PAGE_ROOT',
  REPORTS_LESSON_EXERCISE_QUESTION_PAGE_ROOT: 'REPORTS_LESSON_EXERCISE_QUESTION_PAGE_ROOT',
  REPORTS_GROUP_REPORT_LESSON_EXERCISE_QUESTION_PAGE_ROOT:
    'REPORTS_GROUP_REPORT_LESSON_EXERCISE_QUESTION_PAGE_ROOT',
  REPORTS_GROUP_REPORT_QUIZ_QUESTION_PAGE_ROOT: 'REPORTS_GROUP_REPORT_QUIZ_QUESTION_PAGE_ROOT',
  REPORTS_QUIZ_QUESTION_PAGE_ROOT: 'REPORTS_QUIZ_QUESTION_PAGE_ROOT',
};

export const GroupModals = {
  CREATE_GROUP: 'CREATE_GROUP',
  RENAME_GROUP: 'RENAME_GROUP',
  DELETE_GROUP: 'DELETE_GROUP',
};

export const pageNameToModuleMap = {
  [PageNames.EXAMS]: 'examsRoot',
  [PageNames.EXAM_REPORT]: 'examReport',
  [PageNames.EXAM_REPORT_DETAIL]: 'examReportDetail',
  [LessonsPageNames.PLAN_LESSONS_ROOT]: 'lessonsRoot',
  [LessonsPageNames.RESOURCE_USER_REPORT]: 'exerciseDetail',
  // Omitting modules for resource selection, exam creation, and preview to prevent
  // default module state resetting behavior.
};
