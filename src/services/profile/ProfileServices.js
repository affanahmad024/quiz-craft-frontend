// Profile Services
// Service layer for user profile operations
// Following Phoenix pattern

import { PROFILE_ENDPOINTS } from '../../api/profile/ProfileEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Get current user profile
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @returns {Promise} User profile
 */
export const getUserProfile = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: PROFILE_ENDPOINTS.GET_PROFILE,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch profile.",
  });

/**
 * Update user profile
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { updates }
 * @returns {Promise} Updated profile
 */
export const updateUserProfile = (fetchData, abortContRef, { updates }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: PROFILE_ENDPOINTS.UPDATE_PROFILE,
    payload: updates,
    authRequired: true,
    defaultErrorMsg: "Couldn't update profile.",
  });

/**
 * Delete user account
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @returns {Promise} Deletion response
 */
export const deleteUserAccount = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: PROFILE_ENDPOINTS.DELETE_ACCOUNT,
    authRequired: true,
    defaultErrorMsg: "Couldn't delete account.",
  });

/**
 * Get user statistics
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @returns {Promise} User statistics
 */
export const getUserStatistics = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: PROFILE_ENDPOINTS.GET_USER_STATISTICS,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch statistics.",
  });
