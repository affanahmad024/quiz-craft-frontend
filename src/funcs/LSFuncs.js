// LocalStorage Helper Functions
// Following Phoenix pattern for localStorage management

/**
 * Save data to localStorage
 * @param {string} key - LocalStorage key
 * @param {any} value - Value to store (will be stringified)
 * @returns {boolean} - Success status
 */
export const saveToLS = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Get data from localStorage
 * @param {string} key - LocalStorage key
 * @returns {any|null} - Parsed value or null
 */
export const getFromLS = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - LocalStorage key
 * @returns {boolean} - Success status
 */
export const removeFromLS = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Clear all localStorage data
 * @returns {boolean} - Success status
 */
export const clearLS = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Save data to localStorage with TTL (Time To Live)
 * @param {string} key - LocalStorage key
 * @param {any} value - Value to store
 * @param {number} ttlMinutes - Time to live in minutes
 * @returns {boolean} - Success status
 */
export const saveToLSWithTTL = (key, value, ttlMinutes) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttlMinutes * 60 * 1000,
  };
  return saveToLS(key, item);
};

/**
 * Get data from localStorage with TTL check
 * @param {string} key - LocalStorage key
 * @returns {any|null} - Value if not expired, null otherwise
 */
export const getFromLSWithTTL = (key) => {
  const item = getFromLS(key);

  if (!item) {
    return null;
  }

  const now = new Date();

  // Check if expired
  if (now.getTime() > item.expiry) {
    removeFromLS(key);
    return null;
  }

  return item.value;
};

/**
 * Check if key exists in localStorage
 * @param {string} key - LocalStorage key
 * @returns {boolean} - True if exists
 */
export const existsInLS = (key) => {
  return localStorage.getItem(key) !== null;
};
