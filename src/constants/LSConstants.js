// LocalStorage Keys Constants
// Following Phoenix pattern for consistent localStorage key naming

export const LS_CONSTS = {
  // Authentication
  LS_USER_DATA: 'quizcraft-user-data',
  LS_ACCESS_TOKEN: 'quizcraft-access-token',
  LS_REFRESH_TOKEN: 'quizcraft-refresh-token',

  // User Preferences
  LS_THEME: 'quizcraft-theme',
  LS_LANGUAGE: 'quizcraft-language',

  // Cache with TTL
  LS_CATEGORIES_CACHE: 'quizcraft-categories-cache',
  LS_TAGS_CACHE: 'quizcraft-tags-cache',
};

// Cache TTL in minutes
export const CACHE_TTL = {
  CATEGORIES: 60, // 1 hour
  TAGS: 60, // 1 hour
  USER_DATA: 1440, // 24 hours
};
