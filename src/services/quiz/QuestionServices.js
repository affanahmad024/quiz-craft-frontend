// Question Services
// Service layer for question and answer operations
// Following Phoenix pattern

import { QUESTION_ENDPOINTS } from '../../api/quiz/QuestionEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Add question to quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId, questionData }
 * @returns {Promise} Created question
 */
export const addQuestion = (fetchData, abortContRef, { quizId, questionData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.ADD_QUESTION,
    urlKeys: { id: quizId },
    payload: questionData,
    authRequired: true,
    defaultErrorMsg: "Couldn't add question.",
  });

/**
 * Get question by ID
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { questionId }
 * @returns {Promise} Question details
 */
export const getQuestion = (fetchData, abortContRef, { questionId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.GET_QUESTION,
    urlKeys: { qid: questionId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch question.",
  });

/**
 * Update question
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { questionId, updates }
 * @returns {Promise} Updated question
 */
export const updateQuestion = (fetchData, abortContRef, { questionId, updates }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.UPDATE_QUESTION,
    urlKeys: { qid: questionId },
    payload: updates,
    authRequired: true,
    defaultErrorMsg: "Couldn't update question.",
  });

/**
 * Delete question
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { questionId }
 * @returns {Promise} Deletion response
 */
export const deleteQuestion = (fetchData, abortContRef, { questionId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.DELETE_QUESTION,
    urlKeys: { qid: questionId },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete question.",
  });

/**
 * Add answer to question
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { questionId, answerData }
 * @returns {Promise} Created answer
 */
export const addAnswer = (fetchData, abortContRef, { questionId, answerData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.ADD_ANSWER,
    urlKeys: { qid: questionId },
    payload: answerData,
    authRequired: true,
    defaultErrorMsg: "Couldn't add answer.",
  });

/**
 * Update answer
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { answerId, updates }
 * @returns {Promise} Updated answer
 */
export const updateAnswer = (fetchData, abortContRef, { answerId, updates }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.UPDATE_ANSWER,
    urlKeys: { aid: answerId },
    payload: updates,
    authRequired: true,
    defaultErrorMsg: "Couldn't update answer.",
  });

/**
 * Delete answer
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { answerId }
 * @returns {Promise} Deletion response
 */
export const deleteAnswer = (fetchData, abortContRef, { answerId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.DELETE_ANSWER,
    urlKeys: { aid: answerId },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete answer.",
  });
