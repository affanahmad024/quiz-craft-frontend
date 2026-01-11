// Profile API Endpoints
// Following Phoenix pattern

import { API_METHODS } from '../APIMethods';

/**
 * User Profile Management API Endpoints
 */
export const PROFILE_ENDPOINTS = {
  // Get current user profile
  GET_PROFILE: {
    url: 'users/me',
    method: API_METHODS.GET,
  },

  // Update profile
  UPDATE_PROFILE: {
    url: 'users/me',
    method: API_METHODS.PATCH,
  },

  // Delete account
  DELETE_ACCOUNT: {
    url: 'users/me',
    method: API_METHODS.DELETE,
  },

  // Get user statistics
  GET_USER_STATISTICS: {
    url: 'users/me/statistics',
    method: API_METHODS.GET,
  },
};
