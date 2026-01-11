// Admin Services
// Service layer for admin operations
// Following Phoenix pattern

import { ADMIN_ENDPOINTS } from '../../api/admin/AdminEndpoints';
import { fetchWithAbort } from '../CommonFetch';

// ============ User Management ============

export const listUsers = (fetchData, abortContRef, { page = 1, limit = 20, role, enabled, emailVerified, search, sortBy, sortOrder } = {}) => {
  const params = { page, limit };
  if (role) params.role = role;
  if (enabled !== undefined) params.enabled = enabled;
  if (emailVerified !== undefined) params.email_verified = emailVerified;
  if (search) params.search = search;
  if (sortBy) params.sort_by = sortBy;
  if (sortOrder) params.sort_order = sortOrder;

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.LIST_USERS,
    dynamicQparams: params,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch users.",
  });
};

export const getUserDetails = (fetchData, abortContRef, { userId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.GET_USER_DETAILS,
    urlKeys: { id: userId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch user details.",
  });

export const changeUserRole = (fetchData, abortContRef, { userId, role }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.CHANGE_USER_ROLE,
    urlKeys: { id: userId },
    payload: { role },
    authRequired: true,
    defaultErrorMsg: "Couldn't change user role.",
  });

export const disableUser = (fetchData, abortContRef, { userId, reason }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.DISABLE_USER,
    urlKeys: { id: userId },
    payload: { reason },
    authRequired: true,
    defaultErrorMsg: "Couldn't disable user.",
  });

export const enableUser = (fetchData, abortContRef, { userId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.ENABLE_USER,
    urlKeys: { id: userId },
    authRequired: true,
    defaultErrorMsg: "Couldn't enable user.",
  });

export const deleteUser = (fetchData, abortContRef, { userId, reason, permanent = false }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.DELETE_USER,
    urlKeys: { id: userId },
    payload: { reason, permanent },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete user.",
  });

// ============ Quiz Management ============

export const listQuizzes = (fetchData, abortContRef, { page = 1, limit = 20, isPublished, creatorId, search } = {}) => {
  const params = { page, limit };
  if (isPublished !== undefined) params.is_published = isPublished;
  if (creatorId) params.creator_id = creatorId;
  if (search) params.search = search;

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.LIST_QUIZZES,
    dynamicQparams: params,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch quizzes.",
  });
};

export const getQuizDetails = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.GET_QUIZ_DETAILS,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch quiz details.",
  });

export const deleteQuiz = (fetchData, abortContRef, { quizId, reason, permanent = false }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.DELETE_QUIZ,
    urlKeys: { id: quizId },
    payload: { reason, permanent },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete quiz.",
  });

// ============ Statistics ============

export const getPlatformStats = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.GET_PLATFORM_STATS,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch platform statistics.",
  });

export const getActivityTimeline = (fetchData, abortContRef, { days = 30 } = {}) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.GET_ACTIVITY_TIMELINE,
    dynamicQparams: { days },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch activity timeline.",
  });

export const getActivityLogs = (fetchData, abortContRef, { page = 1, limit = 50 } = {}) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: ADMIN_ENDPOINTS.GET_ACTIVITY_LOGS,
    dynamicQparams: { page, limit },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch activity logs.",
  });
