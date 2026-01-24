// AI Endpoints
// Following Phoenix pattern

import { API_METHODS } from '../APIMethods';

export const AI_ENDPOINTS = {
  // Generate quiz from text content
  GENERATE_FROM_TEXT: {
    url: 'ai/generate-quiz-from-text',
    method: API_METHODS.POST,
  },

  // Generate quiz from uploaded file (PDF/DOCX/TXT)
  GENERATE_FROM_FILE: {
    url: 'ai/generate-quiz-from-file',
    method: API_METHODS.POST,
  },

  // Extract quiz from image/PDF
  EXTRACT_FROM_FILE: {
    url: 'ai/extract-quiz-from-file',
    method: API_METHODS.POST,
  },

  // Get generation job status
  GET_GENERATION_STATUS: {
    url: 'ai/generation-status/:id',
    method: API_METHODS.GET,
  },

  // List all generation jobs for user
  LIST_GENERATION_JOBS: {
    url: 'ai/jobs',
    method: API_METHODS.GET,
  },
};
