// Application-wide Constants
// Following Phoenix pattern for centralized app configuration

export const APP_NAME = 'QuizCraft';

export const APP_VERSION = '1.0.0';

export const APP_DESCRIPTION = 'Create Engaging Quizzes, Learn & Grow';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Quiz Settings
export const QUIZ_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
};

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';
export const DISPLAY_DATETIME_FORMAT = 'MMM DD, YYYY hh:mm A';

// Toast Duration
export const TOAST_DURATION = 4000; // 4 seconds

// Request Timeout
export const REQUEST_TIMEOUT = 60000; // 60 seconds

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Quiz Status
export const QUIZ_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// Attempt Status
export const ATTEMPT_STATUS = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  EXPIRED: 'expired',
};

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  POPULAR: 'popular',
  MOST_ATTEMPTED: 'most_attempted',
};
