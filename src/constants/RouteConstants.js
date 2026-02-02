// Route Path Constants
// Following Phoenix pattern for centralized route definitions

export const ROUTES = {
  // Public Routes
  HOME: '/',
  LANDING: '/welcome',

  // Auth Routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Quiz Routes
  QUIZ_LIST: '/quizzes',
  QUIZ_CREATE: '/quizzes/create',
  QUIZ_DETAIL: '/quizzes/:id',
  QUIZ_EDIT: '/quizzes/:id/edit',
  QUIZ_QUESTIONS: '/quizzes/:id/questions',
  QUIZ_STATS: '/quizzes/:id/stats',

  // Attempt Routes
  QUIZ_START: '/quiz/:id/start',
  QUIZ_TAKE: '/quiz/:id/take/:attemptId',
  ATTEMPT_RESULTS: '/attempts/:id/results',
  ATTEMPT_LIST: '/attempts',

  // Search & Discovery
  DISCOVER: '/discover',
  SEARCH: '/search',
  QUIZ_PREVIEW: '/quiz/:id/preview',
  SHARE_QUIZ: '/share/:code',

  // User Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_STATS: '/profile/statistics',
  CHANGE_PASSWORD: '/profile/change-password',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_QUIZZES: '/admin/quizzes',
  ADMIN_STATS: '/admin/stats',
  ADMIN_LOGS: '/admin/logs',

  // AI Routes
  AI_GENERATE: '/ai/generate',
  AI_JOBS: '/ai/jobs',

  // Notification Routes
  NOTIFICATIONS: '/notifications',

  // Live Session Routes
  LIVE_SESSIONS: '/live-sessions',
  LIVE_SESSION_CREATE: '/live-sessions/create',
  LIVE_SESSION_DETAIL: '/live-sessions/:id',
  LIVE_SESSION_WAITING: '/live-sessions/:id/waiting',
  LIVE_SESSION_LIVE: '/live-sessions/:id/live',
  LIVE_SESSION_RESULTS: '/live-sessions/:id/results',
  MY_SESSIONS: '/my-sessions',
  SESSION_INVITATIONS: '/session-invitations',

  // Utility Routes
  NOT_FOUND: '/404',
};

// Helper to build dynamic routes
export const buildRoute = (route, params = {}) => {
  let builtRoute = route;
  Object.keys(params).forEach((key) => {
    builtRoute = builtRoute.replace(`:${key}`, params[key]);
  });
  return builtRoute;
};
