// JWT Token Helper Functions
// Following Phoenix pattern for token management

/**
 * Decode JWT token (without verification)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null
 */
export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;

  return new Date(decoded.exp * 1000);
};

/**
 * Get user ID from token
 * @param {string} token - JWT token
 * @returns {string|null} - User ID or null
 */
export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.user_id || decoded?.sub || null;
};

/**
 * Get user role from token
 * @param {string} token - JWT token
 * @returns {string|null} - User role or null
 */
export const getUserRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Check if user is admin
 * @param {string} token - JWT token
 * @returns {boolean} - True if admin
 */
export const isAdmin = (token) => {
  const role = getUserRoleFromToken(token);
  return role === 'admin';
};
