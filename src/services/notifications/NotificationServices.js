// Notification Services
// Service layer for notification operations
// Following Phoenix pattern

import { NOTIFICATION_ENDPOINTS } from '../../api/notifications/NotificationEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Get notifications list (paginated)
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { limit, offset, type, unread_only }
 * @returns {Promise} Notifications list with total count
 */
export const getNotifications = (fetchData, abortContRef, params = {}) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS,
    dynamicQparams: params,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch notifications.",
    showErrorToast: false, // Handle errors in context/component
  });

/**
 * Get unread notification count
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @returns {Promise} Unread count
 */
export const getUnreadCount = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: NOTIFICATION_ENDPOINTS.GET_UNREAD_COUNT,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch unread count.",
    showErrorToast: false,
  });

/**
 * Mark single notification as read
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { notificationId }
 * @returns {Promise} Success response
 */
export const markNotificationAsRead = (fetchData, abortContRef, { notificationId }) => {
  const endpoint = {
    url: NOTIFICATION_ENDPOINTS.MARK_AS_READ.url(notificationId),
    method: NOTIFICATION_ENDPOINTS.MARK_AS_READ.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't mark notification as read.",
    showErrorToast: false,
    showSuccessToast: false,
  });
};

/**
 * Mark all notifications as read
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @returns {Promise} Success response
 */
export const markAllNotificationsAsRead = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ,
    authRequired: true,
    defaultErrorMsg: "Couldn't mark all notifications as read.",
    showErrorToast: false,
    showSuccessToast: true,
    successMsg: 'All notifications marked as read',
  });

/**
 * Delete notification
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { notificationId }
 * @returns {Promise} Success response
 */
export const deleteNotification = (fetchData, abortContRef, { notificationId }) => {
  const endpoint = {
    url: NOTIFICATION_ENDPOINTS.DELETE_NOTIFICATION.url(notificationId),
    method: NOTIFICATION_ENDPOINTS.DELETE_NOTIFICATION.method,
  };

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint,
    authRequired: true,
    defaultErrorMsg: "Couldn't delete notification.",
    showErrorToast: true,
    showSuccessToast: false,
  });
};
