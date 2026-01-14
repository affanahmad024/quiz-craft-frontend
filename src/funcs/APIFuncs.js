// API Helper Functions
// Following Phoenix pattern for URL composition and parameter replacement

/**
 * Replace URL parameters with actual values
 * Supports both :param and <param> syntax for flexibility
 * Example: replaceUrlParams('quizzes/:id/questions', { id: '123' })
 * Result: 'quizzes/123/questions'
 *
 * @param {string} url - URL with placeholders (:param or <param>)
 * @param {object} params - Parameters to replace
 * @returns {string} - URL with replaced parameters
 */
export const replaceUrlParams = (url, params) => {
  let replacedUrl = url;

  Object.keys(params).forEach((key) => {
    // Support both :param (standard) and <param> (legacy) syntax
    const colonPlaceholder = `:${key}`;
    const anglePlaceholder = `<${key}>`;

    // Replace :param syntax (e.g., :id, :qid, :aid)
    replacedUrl = replacedUrl.replace(
      colonPlaceholder,
      encodeURIComponent(params[key])
    );

    // Replace <param> syntax for backward compatibility
    replacedUrl = replacedUrl.replace(
      anglePlaceholder,
      encodeURIComponent(params[key])
    );
  });

  return replacedUrl;
};

/**
 * Build query string from parameters object
 * @param {object} params - Query parameters
 * @returns {string} - Query string (e.g., '?key1=value1&key2=value2')
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParams = Object.keys(params)
    .filter((key) => params[key] !== null && params[key] !== undefined)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};

/**
 * Add timestamp parameter to URL for cache busting
 * @param {string} url - URL
 * @returns {string} - URL with timestamp
 */
export const addTimestampParam = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}when=${Date.now()}`;
};

/**
 * Parse query string to object
 * @param {string} queryString - Query string (e.g., '?key1=value1&key2=value2')
 * @returns {object} - Parsed parameters
 */
export const parseQueryString = (queryString) => {
  if (!queryString) return {};

  const params = {};
  const searchParams = new URLSearchParams(queryString);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

/**
 * Build full API URL
 * @param {string} baseUrl - Base API URL
 * @param {string} endpoint - Endpoint path
 * @param {object} urlParams - URL parameters to replace
 * @param {object} queryParams - Query parameters
 * @returns {string} - Full API URL
 */
export const buildApiUrl = (baseUrl, endpoint, urlParams = {}, queryParams = {}) => {
  let url = endpoint;

  // Replace URL parameters
  if (Object.keys(urlParams).length > 0) {
    url = replaceUrlParams(url, urlParams);
  }

  // Add query parameters
  const queryString = buildQueryString(queryParams);
  url = `${baseUrl}/${url}${queryString}`;

  return url;
};

/**
 * Extract file name from Content-Disposition header
 * @param {string} contentDisposition - Content-Disposition header value
 * @returns {string|null} - File name or null
 */
export const extractFileName = (contentDisposition) => {
  if (!contentDisposition) return null;

  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
  if (matches && matches[1]) {
    return matches[1].replace(/['"]/g, '');
  }

  return null;
};
