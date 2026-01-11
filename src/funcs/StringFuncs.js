// String Helper Functions
// Following Phoenix pattern for string manipulation

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} - Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalizeFirst(word))
    .join(' ');
};

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated string
 */
export const truncate = (str, length, suffix = '...') => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

/**
 * Remove extra whitespace from string
 * @param {string} str - String to clean
 * @returns {string} - Cleaned string
 */
export const cleanWhitespace = (str) => {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Convert string to slug (URL-friendly)
 * @param {string} str - String to convert
 * @returns {string} - Slug
 */
export const toSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Check if string is empty or whitespace
 * @param {string} str - String to check
 * @returns {boolean} - True if empty
 */
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @param {number} maxLetters - Maximum letters (default: 2)
 * @returns {string} - Initials
 */
export const getInitials = (name, maxLetters = 2) => {
  if (!name) return '';

  const words = name.trim().split(' ');
  const initials = words
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, maxLetters)
    .join('');

  return initials;
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, total, decimals = 1) => {
  if (!total || total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Pluralize word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, will add 's' if not provided)
 * @returns {string} - Pluralized string
 */
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} - Random string
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Highlight search term in text
 * @param {string} text - Text to search
 * @param {string} term - Search term
 * @returns {string} - Text with highlighted term
 */
export const highlightText = (text, term) => {
  if (!text || !term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};
