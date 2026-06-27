// Attempt API Endpoints
// Following Phoenix pattern

import { API_METHODS } from "../APIMethods";

/**
 * Quiz Attempt Management API Endpoints
 */
export const ATTEMPT_ENDPOINTS = {
  // Start quiz attempt
  START_ATTEMPT: {
    url: "api/v1/quizzes/:id/attempts",
    method: API_METHODS.POST,
  },

  // Get attempt by ID
  GET_ATTEMPT: {
    url: "api/v1/attempts/:id",
    method: API_METHODS.GET,
  },

  // Submit/update answer
  SUBMIT_ANSWER: {
    url: "api/v1/attempts/:id/answers",
    method: API_METHODS.POST,
  },

  // Finish attempt
  FINISH_ATTEMPT: {
    url: "api/v1/attempts/:id/finish",
    method: API_METHODS.POST,
  },

  // Get attempt results
  GET_ATTEMPT_RESULTS: {
    url: "api/v1/attempts/:id/results",
    method: API_METHODS.GET,
  },

  // List my attempts
  LIST_MY_ATTEMPTS: {
    url: "api/v1/attempts",
    method: API_METHODS.GET,
  },
};
