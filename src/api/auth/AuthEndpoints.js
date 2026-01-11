// Authentication API Endpoints
// Following Phoenix pattern for centralized endpoint definitions

import { API_METHODS } from '../APIMethods';

export const AUTH_ENDPOINTS = {
  // Signup
  SIGNUP: {
    url: 'auth/signup',
    method: API_METHODS.POST,
  },

  // Verify Email
  VERIFY_EMAIL: {
    url: 'auth/verify-email',
    method: API_METHODS.POST,
  },

  // Resend Verification Email
  RESEND_VERIFICATION: {
    url: 'auth/resend-verification',
    method: API_METHODS.POST,
  },

  // Login
  LOGIN: {
    url: 'auth/login',
    method: API_METHODS.POST,
  },

  // Refresh Token
  REFRESH_TOKEN: {
    url: 'auth/refresh',
    method: API_METHODS.POST,
  },

  // Forgot Password
  FORGOT_PASSWORD: {
    url: 'auth/forgot-password',
    method: API_METHODS.POST,
  },

  // Reset Password
  RESET_PASSWORD: {
    url: 'auth/reset-password',
    method: API_METHODS.POST,
  },

  // Change Password (Authenticated)
  CHANGE_PASSWORD: {
    url: 'auth/change-password',
    method: API_METHODS.POST,
  },

  // Logout
  LOGOUT: {
    url: 'auth/logout',
    method: API_METHODS.POST,
  },
};
