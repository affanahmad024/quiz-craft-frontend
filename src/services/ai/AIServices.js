// AI Services
// Following Phoenix pattern

import { AI_ENDPOINTS } from '../../api/ai/AIEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Generate quiz from text content
 * @param {Object} config - Configuration object with generation options and quiz metadata
 * @param {Object} config.options - AI generation options (category, num_questions, difficulty, question_type, language)
 * @param {Object} config.metadata - Quiz metadata (title, description, tags, time_limit_minutes, passing_score_percentage)
 */
export const generateQuizFromText = async (
  fetchData,
  abortContRef,
  { text, config }
) => {
  const payload = {
    text,
    options: {
      num_questions: config.num_questions,
      difficulty: config.difficulty,
      question_type: config.question_type,
      category: config.category || 'General',
      language: config.language || 'en',
    },
    // Quiz metadata to be used after generation completes
    metadata: {}
  };

  // Add quiz metadata (these are NOT used for generation, but stored for quiz creation)
  if (config.title) payload.metadata.title = config.title;
  if (config.description) payload.metadata.description = config.description;
  if (config.tags && config.tags.length > 0) payload.metadata.tags = config.tags;
  if (config.time_limit_minutes) payload.metadata.time_limit_minutes = config.time_limit_minutes;
  if (config.passing_score_percentage) payload.metadata.passing_score_percentage = config.passing_score_percentage;

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
 * @param {Object} config - Configuration object with generation options and quiz metadata
 */
export const generateQuizFromFile = async (
  fetchData,
  abortContRef,
  { file, config }
) => {
  const formData = new FormData();
  formData.append('file', file);

  // AI generation options (nested under 'options')
  formData.append('options[num_questions]', config.num_questions);
  formData.append('options[difficulty]', config.difficulty);
  formData.append('options[question_type]', config.question_type);
  formData.append('options[category]', config.category || 'General');
  formData.append('options[language]', config.language || 'en');

  // Quiz metadata (nested under 'metadata')
  if (config.title) {
    formData.append('metadata[title]', config.title);
  }
  if (config.description) {
    formData.append('metadata[description]', config.description);
  }
  if (config.tags && config.tags.length > 0) {
    formData.append('metadata[tags]', config.tags.join(','));
  }
  if (config.time_limit_minutes) {
    formData.append('metadata[time_limit_minutes]', config.time_limit_minutes);
  }
  if (config.passing_score_percentage) {
    formData.append('metadata[passing_score_percentage]', config.passing_score_percentage);
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
 * @param {Object} config - Configuration object with quiz metadata
 */
export const extractQuizFromFile = async (
  fetchData,
  abortContRef,
  { file, config }
) => {
  const formData = new FormData();
  formData.append('file', file);

  // Quiz metadata (extraction doesn't have generation options like num_questions, difficulty)
  if (config.title) {
    formData.append('metadata[title]', config.title);
  }
  if (config.description) {
    formData.append('metadata[description]', config.description);
  }
  if (config.tags && config.tags.length > 0) {
    formData.append('metadata[tags]', config.tags.join(','));
  }
  if (config.time_limit_minutes) {
    formData.append('metadata[time_limit_minutes]', config.time_limit_minutes);
  }
  if (config.passing_score_percentage) {
    formData.append('metadata[passing_score_percentage]', config.passing_score_percentage);
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
  console.log('[AIServices] addQuestionsFromText called with quizId:', quizId);
  console.log('[AIServices] Config:', config);

  const payload = {
    text,
    options: {
      num_questions: config.num_questions,
      difficulty: config.difficulty,
      question_type: config.question_type,
      category: config.category || 'General',
      language: config.language || 'en',
    },
  };

  console.log('[AIServices] Sending payload to /quizzes/' + quizId + '/add-questions-from-text');

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
  console.log('[AIServices] addQuestionsFromFile called with quizId:', quizId);
  console.log('[AIServices] File:', file.name, 'Config:', config);

  const formData = new FormData();
  formData.append('file', file);

  // AI generation options (nested under 'options')
  formData.append('options[num_questions]', config.num_questions);
  formData.append('options[difficulty]', config.difficulty);
  formData.append('options[question_type]', config.question_type);
  formData.append('options[category]', config.category || 'General');
  formData.append('options[language]', config.language || 'en');

  console.log('[AIServices] Sending to /quizzes/' + quizId + '/add-questions-from-file');

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
  console.log('[AIServices] addQuestionsFromImage called with quizId:', quizId);
  console.log('[AIServices] File:', file.name);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('extract_images', extractImages.toString());

  console.log('[AIServices] Sending to /quizzes/' + quizId + '/extract-questions-from-file');

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
