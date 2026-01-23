// Question & Answer API Endpoints
// Following Phoenix pattern

import { API_METHODS } from '../APIMethods';

/**
 * Question & Answer Management API Endpoints
 */
export const QUESTION_ENDPOINTS = {
  // Add question to quiz
  ADD_QUESTION: {
    url: 'quizzes/:id/questions',
    method: API_METHODS.POST,
  },

  // Bulk add questions to quiz
  BULK_ADD_QUESTIONS: {
    url: 'quizzes/:id/questions/bulk',
    method: API_METHODS.POST,
  },

  // Get question by ID
  GET_QUESTION: {
    url: 'quizzes/questions/:qid',
    method: API_METHODS.GET,
  },

  // Update question
  UPDATE_QUESTION: {
    url: 'quizzes/questions/:qid',
    method: API_METHODS.PATCH,
  },

  // Delete question
  DELETE_QUESTION: {
    url: 'quizzes/questions/:qid',
    method: API_METHODS.DELETE,
  },

  // Add answer to question
  ADD_ANSWER: {
    url: 'quizzes/questions/:qid/answers',
    method: API_METHODS.POST,
  },

  // Update answer
  UPDATE_ANSWER: {
    url: 'quizzes/answers/:aid',
    method: API_METHODS.PATCH,
  },

  // Delete answer
  DELETE_ANSWER: {
    url: 'quizzes/answers/:aid',
    method: API_METHODS.DELETE,
  },
};
