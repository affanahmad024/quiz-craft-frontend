// Discovery & Search API Endpoints
// Following Phoenix pattern

import { API_METHODS } from '../APIMethods';

/**
 * Discovery, Search, and Metadata API Endpoints
 */
export const DISCOVERY_ENDPOINTS = {
  // Search quizzes
  SEARCH_QUIZZES: {
    url: 'quizzes/search',
    method: API_METHODS.GET,
  },

  // Get categories
  GET_CATEGORIES: {
    url: 'categories',
    method: API_METHODS.GET,
  },

  // Get popular tags
  GET_TAGS: {
    url: 'tags',
    method: API_METHODS.GET,
  },

  // Get quiz by share code
  GET_QUIZ_BY_SHARE_CODE: {
    url: 'share/:code',
    method: API_METHODS.GET,
  },

  // Get quiz statistics (basic)
  GET_QUIZ_STATS: {
    url: 'quizzes/:id/stats',
    method: API_METHODS.GET,
  },

  // Get quiz statistics (detailed)
  GET_QUIZ_STATISTICS: {
    url: 'quizzes/:id/statistics',
    method: API_METHODS.GET,
  },
};
