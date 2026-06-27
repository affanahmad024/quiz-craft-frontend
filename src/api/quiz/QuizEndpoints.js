// Quiz API Endpoints
// Following Phoenix pattern

import { API_METHODS } from "../APIMethods";

/**
 * Quiz Management API Endpoints
 * All quiz-related endpoints for CRUD operations
 */
export const QUIZ_ENDPOINTS = {
  // Create new quiz
  CREATE_QUIZ: {
    url: "api/v1/quizzes",
    method: API_METHODS.POST,
  },

  // Get quiz by ID (without questions)
  GET_QUIZ: {
    url: "api/v1/quizzes/:id",
    method: API_METHODS.GET,
  },

  // Get quiz with all questions and answers
  GET_QUIZ_FULL: {
    url: "api/v1/quizzes/:id/full",
    method: API_METHODS.GET,
  },

  // List current user's quizzes
  LIST_MY_QUIZZES: {
    url: "api/v1/quizzes",
    method: API_METHODS.GET,
  },

  // List public quizzes
  LIST_PUBLIC_QUIZZES: {
    url: "api/v1/quizzes/public",
    method: API_METHODS.GET,
  },

  // Update quiz
  UPDATE_QUIZ: {
    url: "api/v1/quizzes/:id",
    method: API_METHODS.PATCH,
  },

  // Delete quiz
  DELETE_QUIZ: {
    url: "api/v1/quizzes/:id",
    method: API_METHODS.DELETE,
  },

  // Publish quiz
  PUBLISH_QUIZ: {
    url: "api/v1/quizzes/:id/publish",
    method: API_METHODS.POST,
  },

  // Unpublish quiz
  UNPUBLISH_QUIZ: {
    url: "api/v1/quizzes/:id/unpublish",
    method: API_METHODS.POST,
  },

  // Duplicate quiz
  DUPLICATE_QUIZ: {
    url: "api/v1/quizzes/:id/duplicate",
    method: API_METHODS.POST,
  },

  // Share quiz (generate share code)
  SHARE_QUIZ: {
    url: "api/v1/quizzes/:id/share",
    method: API_METHODS.POST,
  },

  // Get quiz by share code
  GET_QUIZ_BY_SHARE_CODE: {
    url: "api/v1/quizzes/share/:share_code",
    method: API_METHODS.GET,
  },

  // Search quizzes
  SEARCH_QUIZZES: {
    url: "api/v1/quizzes/search",
    method: API_METHODS.GET,
  },
};
