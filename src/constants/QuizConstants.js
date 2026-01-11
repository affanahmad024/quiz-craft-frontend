// Quiz-specific Constants
// Following Phoenix pattern

export const QUIZ_CATEGORIES = [
  'Programming',
  'Mathematics',
  'Science',
  'History',
  'Geography',
  'Literature',
  'Arts',
  'Music',
  'Sports',
  'General Knowledge',
  'Business',
  'Technology',
  'Health',
  'Language',
  'Other',
];

export const DIFFICULTY_COLORS = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

export const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const QUESTION_TYPE_LABELS = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True/False',
  short_answer: 'Short Answer',
};

export const MIN_ANSWERS_REQUIRED = {
  multiple_choice: 2,
  true_false: 2,
  short_answer: 0,
};

export const MAX_ANSWERS_ALLOWED = {
  multiple_choice: 10,
  true_false: 2,
  short_answer: 0,
};

// Validation Rules
export const QUIZ_VALIDATION = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000,
  QUESTION_TEXT_MAX_LENGTH: 1000,
  ANSWER_TEXT_MAX_LENGTH: 500,
  EXPLANATION_MAX_LENGTH: 500,
  MIN_PASSING_SCORE: 0,
  MAX_PASSING_SCORE: 100,
  MIN_TIME_LIMIT: 1,
  MAX_TIME_LIMIT: 300,
  MIN_POINTS: 1,
  MAX_POINTS: 100,
};

// Quiz Creation Steps
export const QUIZ_CREATION_STEPS = [
  { label: 'Quiz Details', key: 'details' },
  { label: 'Add Questions', key: 'questions' },
  { label: 'Review & Publish', key: 'review' },
];
