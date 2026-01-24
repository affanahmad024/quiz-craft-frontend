// AI Services
// Following Phoenix pattern

import { AI_ENDPOINTS } from '../../api/ai/AIEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Generate quiz from text content
 */
export const generateQuizFromText = async (
  fetchData,
  abortContRef,
  { text, config }
) => {
  const payload = {
    text,
    num_questions: config.num_questions,
    difficulty: config.difficulty,
    question_type: config.question_type,
    title: config.title,
  };

  // Add optional fields
  if (config.description) payload.description = config.description;
  if (config.tags && config.tags.length > 0) payload.tags = config.tags;
  if (config.time_limit_minutes) payload.time_limit_minutes = config.time_limit_minutes;
  if (config.passing_score_percentage) payload.passing_score_percentage = config.passing_score_percentage;

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AI_ENDPOINTS.GENERATE_FROM_TEXT,
    payload,
    authRequired: true,
    defaultErrorMsg: "Couldn't generate quiz from text. Please try again.",
  });
};

/**
 * Generate quiz from uploaded file
 */
export const generateQuizFromFile = async (
  fetchData,
  abortContRef,
  { file, config }
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('num_questions', config.num_questions);
  formData.append('difficulty', config.difficulty);
  formData.append('question_type', config.question_type);
  formData.append('title', config.title);

  if (config.description) {
    formData.append('description', config.description);
  }
  if (config.tags && config.tags.length > 0) {
    formData.append('tags', config.tags.join(','));
  }
  if (config.time_limit_minutes) {
    formData.append('time_limit_minutes', config.time_limit_minutes);
  }
  if (config.passing_score_percentage) {
    formData.append('passing_score_percentage', config.passing_score_percentage);
  }

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AI_ENDPOINTS.GENERATE_FROM_FILE,
    payload: formData,
    authRequired: true,
    defaultErrorMsg: "Couldn't generate quiz from file. Please try again.",
  });
};

/**
 * Extract quiz from image/PDF file
 */
export const extractQuizFromFile = async (
  fetchData,
  abortContRef,
  { file, config }
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', config.title);

  if (config.description) {
    formData.append('description', config.description);
  }
  if (config.tags && config.tags.length > 0) {
    formData.append('tags', config.tags.join(','));
  }
  if (config.time_limit_minutes) {
    formData.append('time_limit_minutes', config.time_limit_minutes);
  }
  if (config.passing_score_percentage) {
    formData.append('passing_score_percentage', config.passing_score_percentage);
  }

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AI_ENDPOINTS.EXTRACT_FROM_FILE,
    payload: formData,
    authRequired: true,
    defaultErrorMsg: "Couldn't extract quiz from file. Please try again.",
  });
};

/**
 * Get generation job status
 */
export const getGenerationStatus = (
  fetchData,
  abortContRef,
  { generationId }
) => {
  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AI_ENDPOINTS.GET_GENERATION_STATUS,
    urlKeys: { id: generationId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch generation status.",
  });
};

/**
 * List all generation jobs
 */
export const listGenerationJobs = (
  fetchData,
  abortContRef,
  { page = 1, limit = 10 }
) => {
  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AI_ENDPOINTS.LIST_GENERATION_JOBS,
    dynamicQparams: { page, limit },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch generation jobs.",
  });
};

/**
 * Add questions to existing quiz from text content
 */
export const addQuestionsFromText = async (
  fetchData,
  abortContRef,
  { quizId, text, config }
) => {
  const payload = {
    text,
    options: {
      num_questions: config.num_questions,
      difficulty: config.difficulty,
      question_type: config.question_type,
    },
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AI_ENDPOINTS.ADD_QUESTIONS_FROM_TEXT,
    urlKeys: { id: quizId },
    payload,
    authRequired: true,
    defaultErrorMsg: "Couldn't add questions from text. Please try again.",
  });
};

/**
 * Add questions to existing quiz from uploaded file
 */
export const addQuestionsFromFile = async (
  fetchData,
  abortContRef,
  { quizId, file, config }
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('num_questions', config.num_questions);
  formData.append('difficulty', config.difficulty);
  formData.append('question_type', config.question_type);

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AI_ENDPOINTS.ADD_QUESTIONS_FROM_FILE,
    urlKeys: { id: quizId },
    payload: formData,
    authRequired: true,
    defaultErrorMsg: "Couldn't add questions from file. Please try again.",
  });
};

/**
 * Extract and add questions to existing quiz from image/PDF file
 */
export const addQuestionsFromImage = async (
  fetchData,
  abortContRef,
  { quizId, file, extractImages = true }
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('extract_images', extractImages.toString());

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AI_ENDPOINTS.ADD_QUESTIONS_FROM_IMAGE,
    urlKeys: { id: quizId },
    payload: formData,
    authRequired: true,
    defaultErrorMsg: "Couldn't extract questions from file. Please try again.",
  });
};
