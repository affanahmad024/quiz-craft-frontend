// Live Session Services
// Service layer for live session operations
// Following Phoenix pattern

import { LIVE_SESSION_ENDPOINTS } from '../../api/liveSession/LiveSessionEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Create a new live session
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionData }
 * @returns {Promise} Created session
 */
export const createLiveSession = (fetchData, abortContRef, { sessionData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: LIVE_SESSION_ENDPOINTS.CREATE_SESSION,
    payload: sessionData,
    authRequired: true,
    defaultErrorMsg: "Couldn't create live session.",
    showSuccessToast: true,
    successMsg: 'Live session created successfully!',
  });

/**
 * Get session details
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId }
 * @returns {Promise} Session details
 */
export const getLiveSession = (fetchData, abortContRef, { sessionId }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.GET_SESSION.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.GET_SESSION.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch session details.",
    showErrorToast: false,
  });
};

/**
 * Get playable questions for a live session.
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId }
 * @returns {Promise} Session questions
 */
export const getLiveSessionQuestions = (fetchData, abortContRef, { sessionId }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.GET_SESSION_QUESTIONS.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.GET_SESSION_QUESTIONS.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch session questions.",
    showErrorToast: false,
  });
};

/**
 * Get my created sessions
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { limit, offset, status }
 * @returns {Promise} Sessions list
 */
export const getMySessions = (fetchData, abortContRef, params = {}) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: LIVE_SESSION_ENDPOINTS.GET_MY_SESSIONS,
    dynamicQparams: params,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch your sessions.",
    showErrorToast: false,
  });

/**
 * Get public sessions
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { limit, offset, status }
 * @returns {Promise} Public sessions list
 */
export const getPublicSessions = (fetchData, abortContRef, params = {}) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: LIVE_SESSION_ENDPOINTS.GET_PUBLIC_SESSIONS,
    dynamicQparams: params,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch public sessions.",
    showErrorToast: false,
  });

/**
 * Start a live session
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId }
 * @returns {Promise} Success response
 */
export const startLiveSession = (fetchData, abortContRef, { sessionId }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.START_SESSION.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.START_SESSION.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't start session.",
    showSuccessToast: true,
    successMsg: 'Session started!',
  });
};

/**
 * Advance to next question (manual mode)
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId }
 * @returns {Promise} Success response
 */
export const advanceQuestion = (fetchData, abortContRef, { sessionId }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.ADVANCE_QUESTION.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.ADVANCE_QUESTION.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't advance question.",
    showErrorToast: true,
  });
};

/**
 * End a live session
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId }
 * @returns {Promise} Success response
 */
export const endLiveSession = (fetchData, abortContRef, { sessionId }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.END_SESSION.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.END_SESSION.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't end session.",
    showSuccessToast: true,
    successMsg: 'Session ended',
  });
};

/**
 * Join a live session
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId, accessCode }
 * @returns {Promise} Participant details
 */
export const joinLiveSession = (fetchData, abortContRef, { sessionId, accessCode = null }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.JOIN_SESSION.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.JOIN_SESSION.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    payload: accessCode ? { access_code: accessCode } : {},
    authRequired: true,
    defaultErrorMsg: "Couldn't join session.",
    showSuccessToast: true,
    successMsg: 'Successfully joined session!',
  });
};

/**
 * Submit an answer
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId, answerData }
 * @returns {Promise} Answer result with points
 */
export const submitAnswer = (fetchData, abortContRef, { sessionId, answerData }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.SUBMIT_ANSWER.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.SUBMIT_ANSWER.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    payload: answerData,
    authRequired: true,
    defaultErrorMsg: "Couldn't submit answer.",
    showErrorToast: false, // Handle in component
  });
};

/**
 * Leave a live session
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId }
 * @returns {Promise} Success response
 */
export const leaveLiveSession = (fetchData, abortContRef, { sessionId }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.LEAVE_SESSION.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.LEAVE_SESSION.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't leave session.",
    showErrorToast: false,
  });
};

/**
 * Get session leaderboard
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId, limit }
 * @returns {Promise} Leaderboard data
 */
export const getSessionLeaderboard = (fetchData, abortContRef, { sessionId, limit = 100 }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.GET_LEADERBOARD.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.GET_LEADERBOARD.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    dynamicQparams: { limit },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch leaderboard.",
    showErrorToast: false,
  });
};

/**
 * Get session results (after completion)
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId }
 * @returns {Promise} Detailed results
 */
export const getSessionResults = (fetchData, abortContRef, { sessionId }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.GET_RESULTS.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.GET_RESULTS.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch results.",
    showErrorToast: false,
  });
};

/**
 * Invite users to private session
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { sessionId, userIds }
 * @returns {Promise} Success response
 */
export const inviteUsers = (fetchData, abortContRef, { sessionId, userIds }) => {
  const endpoint = {
    url: LIVE_SESSION_ENDPOINTS.INVITE_USERS.url(sessionId),
    method: LIVE_SESSION_ENDPOINTS.INVITE_USERS.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    payload: { user_ids: userIds },
    authRequired: true,
    defaultErrorMsg: "Couldn't send invitations.",
    showSuccessToast: true,
    successMsg: 'Invitations sent successfully!',
  });
};

/**
 * Get my session invitations
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @returns {Promise} Invitations list
 */
export const getMyInvitations = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: LIVE_SESSION_ENDPOINTS.GET_INVITATIONS,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch invitations.",
    showErrorToast: false,
  });
