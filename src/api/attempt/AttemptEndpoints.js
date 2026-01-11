// Attempt API Endpoints
// Following Phoenix pattern

import { API_METHODS } from '../APIMethods';

/**
 * Quiz Attempt Management API Endpoints
 */
export const ATTEMPT_ENDPOINTS = {
  // Start quiz attempt
  START_ATTEMPT: {
    url: 'quizzes/:id/attempts',
    method: API_METHODS.POST,
  },

  // Get attempt by ID
  GET_ATTEMPT: {
    url: 'attempts/:id',
    method: API_METHODS.GET,
  },

  // Submit/update answer
  SUBMIT_ANSWER: {
    url: 'attempts/:id/answers',
    method: API_METHODS.POST,
  },

  // Finish attempt
  FINISH_ATTEMPT: {
    url: 'attempts/:id/finish',
    method: API_METHODS.POST,
  },

  // Get attempt results
  GET_ATTEMPT_RESULTS: {
    url: 'attempts/:id/results',
    method: API_METHODS.GET,
  },

  // List my attempts
  LIST_MY_ATTEMPTS: {
    url: 'attempts',
    method: API_METHODS.GET,
  },
};
