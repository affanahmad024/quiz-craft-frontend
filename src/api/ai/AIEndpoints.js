// AI Endpoints
// Following Phoenix pattern

import { API_METHODS } from "../APIMethods";

export const AI_ENDPOINTS = {
  // Generate quiz from text content
  GENERATE_FROM_TEXT: {
    url: "api/v1/ai/generate-quiz-from-text",
    method: API_METHODS.POST,
  },

  // Generate quiz from uploaded file (PDF/DOCX/TXT)
  GENERATE_FROM_FILE: {
    url: "api/v1/ai/generate-quiz-from-file",
    method: API_METHODS.POST,
  },

  // Extract quiz from image/PDF
  EXTRACT_FROM_FILE: {
    url: "api/v1/ai/extract-quiz-from-file",
    method: API_METHODS.POST,
  },

  // Get generation job status
  GET_GENERATION_STATUS: {
    url: "api/v1/ai/generation-status/:id",
    method: API_METHODS.GET,
  },

  // List all generation jobs for user
  LIST_GENERATION_JOBS: {
    url: "api/v1/ai/jobs",
    method: API_METHODS.GET,
  },

  // Add questions to existing quiz from text
  ADD_QUESTIONS_FROM_TEXT: {
    url: "api/v1/quizzes/:id/add-questions-from-text",
    method: API_METHODS.POST,
  },

  // Add questions to existing quiz from file
  ADD_QUESTIONS_FROM_FILE: {
    url: "api/v1/quizzes/:id/add-questions-from-file",
    method: API_METHODS.POST,
  },

  // Extract and add questions to existing quiz from file
  ADD_QUESTIONS_FROM_IMAGE: {
    url: "api/v1/quizzes/:id/extract-questions-from-file",
    method: API_METHODS.POST,
  },
};
