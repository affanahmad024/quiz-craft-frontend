// Quiz Services
// Service layer for quiz operations
// Following Phoenix pattern

import { QUIZ_ENDPOINTS } from '../../api/quiz/QuizEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Create a new quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - Quiz data
 * @returns {Promise} Quiz creation response
 */
export const createQuiz = (fetchData, abortContRef, { quizData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.CREATE_QUIZ,
    payload: quizData,
    authRequired: true,
    defaultErrorMsg: "Couldn't create quiz. Please try again.",
  });

/**
 * Get quiz by ID (without questions)
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Quiz details
 */
export const getQuiz = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.GET_QUIZ,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch quiz details.",
  });

/**
 * Get quiz with all questions and answers
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Full quiz with questions
 */
export const getQuizFull = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.GET_QUIZ_FULL,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch quiz with questions.",
  });

/**
 * List current user's quizzes
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { page, limit }
 * @returns {Promise} List of user's quizzes
 */
export const listMyQuizzes = (fetchData, abortContRef, { page = 1, limit = 20 }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.LIST_MY_QUIZZES,
    dynamicQparams: { page, limit },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch your quizzes.",
  });

/**
 * List public quizzes
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { page, limit }
 * @returns {Promise} List of public quizzes
 */
export const listPublicQuizzes = (fetchData, abortContRef, { page = 1, limit = 20 }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.LIST_PUBLIC_QUIZZES,
    dynamicQparams: { page, limit },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch public quizzes.",
  });

/**
 * Update quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId, updates }
 * @returns {Promise} Updated quiz
 */
export const updateQuiz = (fetchData, abortContRef, { quizId, updates }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.UPDATE_QUIZ,
    urlKeys: { id: quizId },
    payload: updates,
    authRequired: true,
    defaultErrorMsg: "Couldn't update quiz.",
  });

/**
 * Delete quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Deletion response
 */
export const deleteQuiz = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.DELETE_QUIZ,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete quiz.",
  });

/**
 * Publish quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Published quiz
 */
export const publishQuiz = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.PUBLISH_QUIZ,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't publish quiz.",
  });

/**
 * Unpublish quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Unpublished quiz
 */
export const unpublishQuiz = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.UNPUBLISH_QUIZ,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't unpublish quiz.",
  });

/**
 * Duplicate quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Duplicated quiz
 */
export const duplicateQuiz = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.DUPLICATE_QUIZ,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't duplicate quiz.",
  });

/**
 * Share quiz (generate share code)
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Share code response
 */
export const shareQuiz = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.SHARE_QUIZ,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't generate share code.",
  });

/**
 * Get quiz by share code
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { shareCode }
 * @returns {Promise} Quiz details
 */
export const getQuizByShareCode = (fetchData, abortContRef, { shareCode }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.GET_QUIZ_BY_SHARE_CODE,
    urlKeys: { share_code: shareCode },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch quiz with share code.",
  });

/**
 * Search quizzes
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { query, page, limit }
 * @returns {Promise} Search results
 */
export const searchQuizzes = (fetchData, abortContRef, { query, page = 1, limit = 20 }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.SEARCH_QUIZZES,
    dynamicQparams: { q: query, page, limit },
    authRequired: true,
    defaultErrorMsg: "Couldn't search quizzes.",
  });
