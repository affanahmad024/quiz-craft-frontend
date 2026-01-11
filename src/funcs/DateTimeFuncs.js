// Date and Time Helper Functions
// Following Phoenix pattern for date manipulation

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

/**
 * Format date to specified format
 * @param {string|Date} date - Date to format
 * @param {string} format - Desired format (default: 'MMM DD, YYYY')
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Format date time to specified format
 * @param {string|Date} dateTime - DateTime to format
 * @param {string} format - Desired format (default: 'MMM DD, YYYY hh:mm A')
 * @returns {string} - Formatted date time
 */
export const formatDateTime = (dateTime, format = 'MMM DD, YYYY hh:mm A') => {
  if (!dateTime) return '';
  return dayjs(dateTime).format(format);
};

/**
 * Get relative time (e.g., '2 hours ago', '3 days ago')
 * @param {string|Date} date - Date
 * @returns {string} - Relative time
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

/**
 * Format duration in seconds to human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration (e.g., '25:34' or '1:05:23')
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '00:00';

  const duration = dayjs.duration(seconds, 'seconds');
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const secs = duration.seconds();

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

/**
 * Parse duration string to seconds
 * @param {string} durationStr - Duration string (e.g., '25:34' or '1:05:23')
 * @returns {number} - Duration in seconds
 */
export const parseDuration = (durationStr) => {
  if (!durationStr) return 0;

  const parts = durationStr.split(':').map(Number);

  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if today
 */
export const isToday = (date) => {
  if (!date) return false;
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if in the past
 */
export const isPast = (date) => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs());
};

/**
 * Check if date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if in the future
 */
export const isFuture = (date) => {
  if (!date) return false;
  return dayjs(date).isAfter(dayjs());
};

/**
 * Get difference between two dates in specified unit
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @param {string} unit - Unit (default: 'days')
 * @returns {number} - Difference
 */
export const getDateDifference = (date1, date2, unit = 'days') => {
  if (!date1 || !date2) return 0;
  return dayjs(date1).diff(dayjs(date2), unit);
};

/**
 * Add time to date
 * @param {string|Date} date - Date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit (default: 'days')
 * @returns {Date} - New date
 */
export const addToDate = (date, amount, unit = 'days') => {
  if (!date) return null;
  return dayjs(date).add(amount, unit).toDate();
};

/**
 * Get start of day
 * @param {string|Date} date - Date
 * @returns {Date} - Start of day
 */
export const getStartOfDay = (date) => {
  if (!date) return null;
  return dayjs(date).startOf('day').toDate();
};

/**
 * Get end of day
 * @param {string|Date} date - Date
 * @returns {Date} - End of day
 */
export const getEndOfDay = (date) => {
  if (!date) return null;
  return dayjs(date).endOf('day').toDate();
};
