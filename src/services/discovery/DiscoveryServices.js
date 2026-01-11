// Discovery Services
// Service layer for search and discovery operations
// Following Phoenix pattern

import { DISCOVERY_ENDPOINTS } from '../../api/discovery/DiscoveryEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Search quizzes with filters
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - Search parameters
 * @returns {Promise} Search results
 */
export const searchQuizzes = (
  fetchData,
  abortContRef,
  {
    query = '',
    category = '',
    difficulty = '',
    tags = '',
    creatorId = '',
    isTemplate = null,
    sortBy = 'newest',
    sortOrder = 'desc',
    page = 1,
    limit = 20,
  }
) => {
  const queryParams = { page, limit };

  if (query) queryParams.q = query;
  if (category) queryParams.category = category;
  if (difficulty) queryParams.difficulty = difficulty;
  if (tags) queryParams.tags = tags;
  if (creatorId) queryParams.creator_id = creatorId;
  if (isTemplate !== null) queryParams.is_template = isTemplate;
  if (sortBy) queryParams.sort_by = sortBy;
  if (sortOrder) queryParams.sort_order = sortOrder;

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: DISCOVERY_ENDPOINTS.SEARCH_QUIZZES,
    dynamicQparams: queryParams,
    authRequired: false,
    defaultErrorMsg: "Couldn't search quizzes.",
  });
};

/**
 * Get all categories
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @returns {Promise} List of categories
 */
export const getCategories = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: DISCOVERY_ENDPOINTS.GET_CATEGORIES,
    authRequired: false,
    defaultErrorMsg: "Couldn't fetch categories.",
  });

/**
 * Get popular tags
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @returns {Promise} List of popular tags
 */
export const getTags = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: DISCOVERY_ENDPOINTS.GET_TAGS,
    authRequired: false,
    defaultErrorMsg: "Couldn't fetch tags.",
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
    endpoint: DISCOVERY_ENDPOINTS.GET_QUIZ_BY_SHARE_CODE,
    urlKeys: { code: shareCode },
    authRequired: false,
    defaultErrorMsg: "Couldn't fetch quiz with share code.",
  });

/**
 * Get basic quiz statistics
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Quiz stats
 */
export const getQuizStats = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: DISCOVERY_ENDPOINTS.GET_QUIZ_STATS,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch quiz statistics.",
  });

/**
 * Get detailed quiz statistics
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId }
 * @returns {Promise} Detailed quiz statistics
 */
export const getQuizStatistics = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: DISCOVERY_ENDPOINTS.GET_QUIZ_STATISTICS,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch detailed quiz statistics.",
  });
