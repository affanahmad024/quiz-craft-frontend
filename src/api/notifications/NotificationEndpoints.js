// Notification API Endpoints
// Following Phoenix pattern for centralized endpoint definitions

import { API_METHODS } from "../APIMethods";

export const NOTIFICATION_ENDPOINTS = {
  // Get notifications list (paginated)
  GET_NOTIFICATIONS: {
    url: "api/v1/notifications",
    method: API_METHODS.GET,
  },

  // Get unread notification count
  GET_UNREAD_COUNT: {
    url: "api/v1/notifications/unread-count",
    method: API_METHODS.GET,
  },

  // Mark single notification as read
  MARK_AS_READ: {
    url: (id) => `notifications/${id}/read`,
    method: API_METHODS.PATCH,
  },

  // Mark all notifications as read
  MARK_ALL_AS_READ: {
    url: "api/v1/notifications/read-all",
    method: API_METHODS.PATCH,
  },

  // Delete notification
  DELETE_NOTIFICATION: {
    url: (id) => `notifications/${id}`,
    method: API_METHODS.DELETE,
  },

  // WebSocket endpoint (will be used for establishing WS connection)
  WS_NOTIFICATIONS: {
    url: "api/v1/notifications/ws",
    method: "WS", // Custom method indicator for WebSocket
  },
};
