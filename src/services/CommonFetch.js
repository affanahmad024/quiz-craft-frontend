// Common Fetch Utility
// Following Phoenix pattern for API service abstraction

import { replaceUrlParams, buildQueryString } from '../funcs/APIFuncs';
import toast from 'react-hot-toast';

/**
 * Fetch data with abort controller support
 * Following Phoenix pattern for centralized API calls
 *
 * @param {object} config - Fetch configuration
 * @returns {Promise<object>} - { success: boolean, data?: any, error?: any }
 */
export const fetchWithAbort = async ({
  fetchData,
  abortContRef,
  endpoint,
  urlKeys = {},
  dynamicQparams = null,
  onSuccess = undefined,
  onError = undefined,
  payload = null,
  defaultErrorMsg = null,
  showSuccessToast = false,
  successMsg = 'Operation successful',
  authRequired = true,
}) => {
  try {
    // Abort previous request if exists
    if (abortContRef.current) {
      abortContRef.current.abort();
    }
    abortContRef.current = new AbortController();

    // Build URL
    let url = endpoint.url;

    // Replace URL parameters (e.g., 'quizzes/<id>' -> 'quizzes/123')
    if (Object.keys(urlKeys).length > 0) {
      url = replaceUrlParams(url, urlKeys);
    }

    // Add query parameters
    if (dynamicQparams) {
      const queryString = buildQueryString(dynamicQparams);
      url = `${url}${queryString}`;
    }

    // Make request
    const response = await fetchData({
      url,
      method: endpoint.method,
      body: payload,
      authRequired,
      signal: abortContRef.current.signal,
    });

    // Handle success
    if (response?.data) {
      if (showSuccessToast) {
        toast.success(successMsg);
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      return { success: true, data: response.data };
    }

    // Handle error response from API
    const errorMessage =
      response?.error?.message || defaultErrorMsg || 'An error occurred';
    toast.error(errorMessage);

    if (onError) {
      onError(response?.error);
    }

    return { success: false, error: response?.error };
  } catch (error) {
    // Handle abort error (don't show toast)
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      console.log('Request aborted');
      return { success: false, aborted: true };
    }

    // Handle other errors
    console.error('Fetch error:', error);
    const errorMsg = error.message || defaultErrorMsg || 'Network error occurred';
    toast.error(errorMsg);

    if (onError) {
      onError(error);
    }

    return { success: false, error };
  }
};

/**
 * Download file with abort controller support
 * @param {object} config - Download configuration
 * @returns {Promise<object>} - { success: boolean, blob?: Blob, filename?: string }
 */
export const downloadFileWithAbort = async ({
  fetchData,
  abortContRef,
  endpoint,
  urlKeys = {},
  defaultErrorMsg = 'Failed to download file',
}) => {
  try {
    // Abort previous request
    if (abortContRef.current) {
      abortContRef.current.abort();
    }
    abortContRef.current = new AbortController();

    // Build URL
    let url = endpoint.url;
    if (Object.keys(urlKeys).length > 0) {
      url = replaceUrlParams(url, urlKeys);
    }

    // Make request
    const response = await fetchData({
      url,
      method: endpoint.method,
      authRequired: true,
      responseType: 'blob',
      signal: abortContRef.current.signal,
    });

    if (response?.data) {
      return {
        success: true,
        blob: response.data,
        filename: 'download',
      };
    }

    toast.error(defaultErrorMsg);
    return { success: false };
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      return { success: false, aborted: true };
    }

    console.error('Download error:', error);
    toast.error(defaultErrorMsg);
    return { success: false, error };
  }
};
