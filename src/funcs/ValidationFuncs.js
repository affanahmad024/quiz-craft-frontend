// Validation Helper Functions
// Following Phoenix pattern for form validation

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate password match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {boolean} - True if match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} - True if not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} - True if valid
 */
export const isValidLength = (value, min, max) => {
  if (!value) return false;
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if valid
 */
export const isInRange = (value, min, max) => {
  if (value === null || value === undefined) return false;
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate phone number (basic)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeBytes - Maximum size in bytes
 * @returns {boolean} - True if valid
 */
export const isValidFileSize = (file, maxSizeBytes) => {
  if (!file) return false;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} - True if valid
 */
export const isValidFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validate quiz title
 * @param {string} title - Quiz title
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateQuizTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }

  if (title.trim().length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }

  if (title.trim().length > 255) {
    return { valid: false, error: 'Title must be less than 255 characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validate quiz passing score
 * @param {number} score - Passing score
 * @returns {object} - { valid: boolean, error: string }
 */
export const validatePassingScore = (score) => {
  const num = Number(score);

  if (isNaN(num)) {
    return { valid: false, error: 'Passing score must be a number' };
  }

  if (num < 0 || num > 100) {
    return { valid: false, error: 'Passing score must be between 0 and 100' };
  }

  return { valid: true, error: null };
};

/**
 * Validate quiz time limit
 * @param {number} minutes - Time limit in minutes
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateTimeLimit = (minutes) => {
  const num = Number(minutes);

  if (isNaN(num)) {
    return { valid: false, error: 'Time limit must be a number' };
  }

  if (num < 1 || num > 300) {
    return { valid: false, error: 'Time limit must be between 1 and 300 minutes' };
  }

  return { valid: true, error: null };
};
