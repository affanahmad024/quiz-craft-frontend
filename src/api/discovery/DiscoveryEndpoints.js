// Discovery & Search API Endpoints
// Following Phoenix pattern

import { API_METHODS } from "../APIMethods";

/**
 * Discovery, Search, and Metadata API Endpoints
 */
export const DISCOVERY_ENDPOINTS = {
  // Search quizzes
  SEARCH_QUIZZES: {
    url: "api/v1/quizzes/search",
    method: API_METHODS.GET,
  },

  // Get categories
  GET_CATEGORIES: {
    url: "api/v1/categories",
    method: API_METHODS.GET,
  },

  // Get popular tags
  GET_TAGS: {
    url: "api/v1/tags",
    method: API_METHODS.GET,
  },

  // Get quiz by share code
  GET_QUIZ_BY_SHARE_CODE: {
    url: "api/v1/share/:code",
    method: API_METHODS.GET,
  },

  // Get quiz statistics (basic)
  GET_QUIZ_STATS: {
    url: "api/v1/quizzes/:id/stats",
    method: API_METHODS.GET,
  },

  // Get quiz statistics (detailed)
  GET_QUIZ_STATISTICS: {
    url: "api/v1/quizzes/:id/statistics",
    method: API_METHODS.GET,
  },
};
