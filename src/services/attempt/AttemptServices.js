// Attempt Services
// Service layer for quiz attempt operations
// Following Phoenix pattern

import { ATTEMPT_ENDPOINTS } from '../../api/attempt/AttemptEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Start a new quiz attempt
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Created attempt
 */
export const startAttempt = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ATTEMPT_ENDPOINTS.START_ATTEMPT,
    urlKeys: { id: quizId },
    payload: { quiz_id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't start quiz attempt.",
  });

/**
 * Get attempt by ID
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { attemptId }
 * @returns {Promise} Attempt details
 */
export const getAttempt = (fetchData, abortContRef, { attemptId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ATTEMPT_ENDPOINTS.GET_ATTEMPT,
    urlKeys: { id: attemptId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch attempt details.",
  });

/**
 * Submit/update answer for a question
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { attemptId, questionId, answerId, answerText }
 * @returns {Promise} User answer
 */
export const submitAnswer = (fetchData, abortContRef, { attemptId, questionId, answerId, answerText }) => {
  const payload = {
    question_id: questionId,
  };

  if (answerId) {
    payload.answer_id = answerId;
  } else if (answerText !== undefined) {
    payload.answer_text = answerText;
  }

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ATTEMPT_ENDPOINTS.SUBMIT_ANSWER,
    urlKeys: { id: attemptId },
    payload,
    authRequired: true,
    defaultErrorMsg: "Couldn't submit answer.",
  });
};

/**
 * Finish attempt and calculate final score
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { attemptId }
 * @returns {Promise} Finished attempt
 */
export const finishAttempt = (fetchData, abortContRef, { attemptId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ATTEMPT_ENDPOINTS.FINISH_ATTEMPT,
    urlKeys: { id: attemptId },
    authRequired: true,
    defaultErrorMsg: "Couldn't finish attempt.",
  });

/**
 * Get attempt results with correct answers
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { attemptId }
 * @returns {Promise} Full attempt results
 */
export const getAttemptResults = (fetchData, abortContRef, { attemptId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ATTEMPT_ENDPOINTS.GET_ATTEMPT_RESULTS,
    urlKeys: { id: attemptId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch attempt results.",
  });

/**
 * List user's attempts
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { page, limit, quizId, status }
 * @returns {Promise} List of attempts
 */
export const listMyAttempts = (fetchData, abortContRef, { page = 1, limit = 20, quizId, status }) => {
  const params = { page, limit };
  if (quizId) params.quiz_id = quizId;
  if (status) params.status = status;

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ATTEMPT_ENDPOINTS.LIST_MY_ATTEMPTS,
    dynamicQparams: params,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch attempts.",
  });
};
