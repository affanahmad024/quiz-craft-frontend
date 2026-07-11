// Question & Answer API Endpoints
// Following Phoenix pattern

import { API_METHODS } from "../APIMethods";

/**
 * Question & Answer Management API Endpoints
 */
export const QUESTION_ENDPOINTS = {
  // List sections
  LIST_SECTIONS: {
    url: "api/v1/quizzes/:id/sections",
    method: API_METHODS.GET,
  },

  // Create section
  CREATE_SECTION: {
    url: "api/v1/quizzes/:id/sections",
    method: API_METHODS.POST,
  },

  // Update section
  UPDATE_SECTION: {
    url: "api/v1/quizzes/:id/sections/:sid",
    method: API_METHODS.PATCH,
  },

  // Delete section
  DELETE_SECTION: {
    url: "api/v1/quizzes/:id/sections/:sid",
    method: API_METHODS.DELETE,
  },

  // Reorder sections
  REORDER_SECTIONS: {
    url: "api/v1/quizzes/:id/sections/reorder",
    method: API_METHODS.PATCH,
  },

  // Reorder questions across sections
  REORDER_QUESTIONS: {
    url: "api/v1/quizzes/:id/questions/reorder",
    method: API_METHODS.PATCH,
  },

  // Move one question to a section
  MOVE_QUESTION_TO_SECTION: {
    url: "api/v1/quizzes/questions/:qid/section",
    method: API_METHODS.PATCH,
  },
  // Add question to quiz
  ADD_QUESTION: {
    url: "api/v1/quizzes/:id/questions",
    method: API_METHODS.POST,
  },

  // Bulk add questions to quiz
  BULK_ADD_QUESTIONS: {
    url: "api/v1/quizzes/:id/questions/bulk",
    method: API_METHODS.POST,
  },

  // Get question by ID
  GET_QUESTION: {
    url: "api/v1/quizzes/questions/:qid",
    method: API_METHODS.GET,
  },

  // Update question
  UPDATE_QUESTION: {
    url: "api/v1/quizzes/questions/:qid",
    method: API_METHODS.PATCH,
  },

  // Delete question
  DELETE_QUESTION: {
    url: "api/v1/quizzes/questions/:qid",
    method: API_METHODS.DELETE,
  },

  // Add answer to question
  ADD_ANSWER: {
    url: "api/v1/quizzes/questions/:qid/answers",
    method: API_METHODS.POST,
  },

  // Update answer
  UPDATE_ANSWER: {
    url: "api/v1/quizzes/answers/:aid",
    method: API_METHODS.PATCH,
  },

  // Delete answer
  DELETE_ANSWER: {
    url: "api/v1/quizzes/answers/:aid",
    method: API_METHODS.DELETE,
  },
};

