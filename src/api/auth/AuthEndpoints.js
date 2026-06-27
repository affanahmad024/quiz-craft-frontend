// Authentication API Endpoints
// Following Phoenix pattern for centralized endpoint definitions

import { API_METHODS } from "../APIMethods";

export const AUTH_ENDPOINTS = {
  // Signup
  SIGNUP: {
    url: "api/v1/auth/signup",
    method: API_METHODS.POST,
  },

  // Verify Email
  VERIFY_EMAIL: {
    url: "api/v1/auth/verify-email",
    method: API_METHODS.POST,
  },

  // Resend Verification Email
  RESEND_VERIFICATION: {
    url: "api/v1/auth/resend-verification",
    method: API_METHODS.POST,
  },

  // Login
  LOGIN: {
    url: "api/v1/auth/login",
    method: API_METHODS.POST,
  },

  // Refresh Token
  REFRESH_TOKEN: {
    url: "api/v1/auth/refresh",
    method: API_METHODS.POST,
  },

  // Forgot Password
  FORGOT_PASSWORD: {
    url: "api/v1/auth/forgot-password",
    method: API_METHODS.POST,
  },

  // Reset Password
  RESET_PASSWORD: {
    url: "api/v1/auth/reset-password",
    method: API_METHODS.POST,
  },

  // Change Password (Authenticated)
  CHANGE_PASSWORD: {
    url: "api/v1/auth/change-password",
    method: API_METHODS.POST,
  },

  // Logout
  LOGOUT: {
    url: "api/v1/auth/logout",
    method: API_METHODS.POST,
  },
};
