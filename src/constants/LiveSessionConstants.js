// Live Session Constants
// Following Phoenix pattern for centralized live session configuration

/**
 * Session Status
 */
export const SESSION_STATUS = {
  WAITING: 'waiting',     // Waiting for participants/start
  LIVE: 'live',           // Session is active
  COMPLETED: 'completed', // Session has ended
  CANCELLED: 'cancelled', // Session was cancelled
};

/**
 * Session Types
 */
export const SESSION_TYPES = {
  PUBLIC: 'public',   // Anyone can join
  PRIVATE: 'private', // Requires access code
};

/**
 * Progression Modes
 */
export const PROGRESSION_MODES = {
  AUTOMATIC: 'automatic', // Timer-based, auto-advances
  MANUAL: 'manual',       // Host manually advances questions
};

/**
 * Timer Modes
 */
export const TIMER_MODES = {
  PER_QUESTION: 'per_question', // Each question has its own timer
  WHOLE_QUIZ: 'whole_quiz',     // Total time for entire quiz
};

/**
 * Participant Status
 */
export const PARTICIPANT_STATUS = {
  ACTIVE: 'active',       // Currently participating
  COMPLETED: 'completed', // Finished the session
  LEFT: 'left',           // Left the session
};

/**
 * WebSocket Message Types
 */
export const SESSION_WS_MESSAGE_TYPES = {
  SESSION_STARTED: 'session_started',
  QUESTION_REVEALED: 'question_revealed',
  TIMER_UPDATE: 'timer_update',
  WHOLE_QUIZ_TIMER_UPDATE: 'whole_quiz_timer_update',
  QUESTION_AUTO_ADVANCE: 'question_auto_advance',
  LEADERBOARD_UPDATE: 'leaderboard_update',
  SESSION_ENDED: 'session_ended',
  PARTICIPANT_JOINED: 'participant_joined',
  PARTICIPANT_LEFT: 'participant_left',
  ERROR: 'error',
};

/**
 * Timer Configuration
 */
export const TIMER_CONFIG = {
  MIN_SECONDS: 5,      // Minimum time per question
  MAX_SECONDS: 300,    // Maximum time per question (5 minutes)
  DEFAULT_SECONDS: 30, // Default time per question
  WARNING_SECONDS: 10, // Show warning when time < this
};

/**
 * Session Configuration
 */
export const SESSION_CONFIG = {
  MIN_PARTICIPANTS: 1,    // Minimum participants to start
  DEFAULT_MAX_PARTICIPANTS: 100, // Default max participants
  PAGE_SIZE: 20,          // Sessions per page
};

/**
 * Scoring Configuration
 */
export const SCORING_CONFIG = {
  BASE_POINTS: 100,       // Base points for correct answer
  SPEED_BONUS_MULTIPLIER: 0.5, // Speed bonus multiplier (50% max)
  MIN_POINTS: 0,          // Minimum points (for wrong answer)
};

/**
 * WebSocket Configuration for Live Sessions
 */
export const SESSION_WS_CONFIG = {
  MAX_RECONNECT_ATTEMPTS: 3,  // Max reconnect tries for live session
  RECONNECT_DELAY_BASE: 1000, // Start delay (1s)
  RECONNECT_DELAY_MAX: 10000, // Max delay (10s)
};

/**
 * Session Status Colors
 */
export const SESSION_STATUS_COLORS = {
  [SESSION_STATUS.WAITING]: '#f59e0b',    // Orange
  [SESSION_STATUS.LIVE]: '#ef4444',       // Red
  [SESSION_STATUS.COMPLETED]: '#9e9e9e',  // Gray
  [SESSION_STATUS.CANCELLED]: '#64748b',  // Slate
};

/**
 * Session Status Labels
 */
export const SESSION_STATUS_LABELS = {
  [SESSION_STATUS.WAITING]: 'Starting Soon',
  [SESSION_STATUS.LIVE]: 'Live Now',
  [SESSION_STATUS.COMPLETED]: 'Completed',
  [SESSION_STATUS.CANCELLED]: 'Cancelled',
};

/**
 * Calculate points earned based on time taken
 * Formula: basePoints * (1 + speedBonus)
 * speedBonus = (1 - timeTaken/maxTime) * SPEED_BONUS_MULTIPLIER
 *
 * @param {number} timeTakenMs - Time taken in milliseconds
 * @param {number} maxTimeSeconds - Maximum time allowed in seconds
 * @returns {number} Points earned
 */
export const calculatePoints = (timeTakenMs, maxTimeSeconds) => {
  const timeTakenSeconds = timeTakenMs / 1000;
  const speedBonus = (1 - timeTakenSeconds / maxTimeSeconds) * SCORING_CONFIG.SPEED_BONUS_MULTIPLIER;
  const points = SCORING_CONFIG.BASE_POINTS * (1 + Math.max(0, speedBonus));
  return Math.round(points);
};

/**
 * Format time in MM:SS format
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
