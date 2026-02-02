// Notification Constants
// Following Phoenix pattern for centralized notification configuration

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  NEW_QUIZ: 'new_quiz',
  LIVE_SESSION_SCHEDULED: 'live_session_scheduled',
  LIVE_SESSION_STARTING: 'live_session_starting',
  LIVE_SESSION_INVITATION: 'live_session_invitation',
  NEW_FOLLOWER: 'new_follower',
  SYSTEM: 'system',
};

/**
 * Notification Type Icons (MUI icons)
 */
export const NOTIFICATION_TYPE_ICONS = {
  [NOTIFICATION_TYPES.NEW_QUIZ]: 'Quiz',
  [NOTIFICATION_TYPES.LIVE_SESSION_SCHEDULED]: 'Event',
  [NOTIFICATION_TYPES.LIVE_SESSION_STARTING]: 'Alarm',
  [NOTIFICATION_TYPES.LIVE_SESSION_INVITATION]: 'Mail',
  [NOTIFICATION_TYPES.NEW_FOLLOWER]: 'Person',
  [NOTIFICATION_TYPES.SYSTEM]: 'Notifications',
};

/**
 * Notification Type Colors
 */
export const NOTIFICATION_TYPE_COLORS = {
  [NOTIFICATION_TYPES.NEW_QUIZ]: '#667eea',
  [NOTIFICATION_TYPES.LIVE_SESSION_SCHEDULED]: '#f59e0b',
  [NOTIFICATION_TYPES.LIVE_SESSION_STARTING]: '#ef4444',
  [NOTIFICATION_TYPES.LIVE_SESSION_INVITATION]: '#8b5cf6',
  [NOTIFICATION_TYPES.NEW_FOLLOWER]: '#10b981',
  [NOTIFICATION_TYPES.SYSTEM]: '#3b82f6',
};

/**
 * WebSocket Configuration
 */
export const NOTIFICATION_WS_CONFIG = {
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_BASE: 1000, // Base delay in ms
  RECONNECT_DELAY_MAX: 30000, // Max delay in ms
};

/**
 * Notification Settings
 */
export const NOTIFICATION_SETTINGS = {
  PAGE_SIZE: 20, // Number of notifications per page
  MAX_DROPDOWN_ITEMS: 5, // Number of notifications in dropdown
  TOAST_DURATION: 5000, // Duration for toast notifications (5 seconds)
  MARK_AS_READ_ON_CLICK: true, // Auto-mark as read when clicked
};

/**
 * WebSocket Message Types
 */
export const WS_MESSAGE_TYPES = {
  NOTIFICATION: 'notification',
  CONNECTED: 'connected',
  ERROR: 'error',
};
