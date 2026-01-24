// Authentication Services
// Following Phoenix pattern for service layer abstraction

import { AUTH_ENDPOINTS } from '../../api/auth/AuthEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * User signup
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @param {object} signupData - Signup data (email, name, password, phone_number)
 * @returns {Promise} Response
 */
export const signupUser = (fetchData, abortContRef, { signupData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.SIGNUP,
    payload: signupData,
    authRequired: false,
    defaultErrorMsg: "Couldn't create account",
  });

/**
 * Verify email with token
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @param {string} userId - User ID
 * @param {string} token - Verification token
 * @returns {Promise} Response
 */
export const verifyEmail = (fetchData, abortContRef, { userId, token }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.VERIFY_EMAIL,
    payload: { user_id: userId, token },
    authRequired: false,
    showErrorToast: false, // Don't show automatic error toast - component handles errors
    defaultErrorMsg: "Couldn't verify email",
  });

/**
 * Resend verification email
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @param {string} email - User email
 * @returns {Promise} Response
 */
export const resendVerification = (fetchData, abortContRef, { email }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.RESEND_VERIFICATION,
    payload: { email },
    authRequired: false,
    defaultErrorMsg: "Couldn't resend verification email",
  });

/**
 * User login
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @param {object} credentials - Login credentials (email, password)
 * @returns {Promise} Response
 */
export const loginUser = (fetchData, abortContRef, { credentials }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.LOGIN,
    payload: credentials,
    authRequired: false,
    defaultErrorMsg: "Couldn't login. Please check your credentials.",
  });

/**
 * Refresh access token
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} Response
 */
export const refreshAccessToken = (fetchData, abortContRef, { refreshToken }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.REFRESH_TOKEN,
    payload: { refresh_token: refreshToken },
    authRequired: false,
    defaultErrorMsg: "Couldn't refresh token. Please login again.",
  });

/**
 * Request password reset
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @param {string} email - User email
 * @returns {Promise} Response
 */
export const forgotPassword = (fetchData, abortContRef, { email }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.FORGOT_PASSWORD,
    payload: { email },
    authRequired: false,
    defaultErrorMsg: "Couldn't send password reset email",
  });

/**
 * Reset password with token
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @param {string} userId - User ID
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} Response
 */
export const resetPassword = (
  fetchData,
  abortContRef,
  { userId, token, newPassword }
) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.RESET_PASSWORD,
    payload: { user_id: userId, token, new_password: newPassword },
    authRequired: false,
    defaultErrorMsg: "Couldn't reset password",
  });

/**
 * Change password (when authenticated)
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Response
 */
export const changePassword = (
  fetchData,
  abortContRef,
  { currentPassword, newPassword }
) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.CHANGE_PASSWORD,
    payload: { current_password: currentPassword, new_password: newPassword },
    authRequired: true,
    defaultErrorMsg: "Couldn't change password",
  });

/**
 * Logout user
 * @param {function} fetchData - Network request function
 * @param {object} abortContRef - AbortController ref
 * @returns {Promise} Response
 */
export const logoutUser = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: AUTH_ENDPOINTS.LOGOUT,
    authRequired: true,
    defaultErrorMsg: "Couldn't logout",
    showSuccessToast: true,
    successMsg: 'Logged out successfully',
  });
