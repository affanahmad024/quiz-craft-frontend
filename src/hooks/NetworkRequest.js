// Network Request Hook
// Following Phoenix pattern - Axios wrapper with authentication

import { useState, useCallback } from 'react';
import axios from 'axios';
import { getFromLS } from '../funcs/LSFuncs';
import { LS_CONSTS } from '../constants/LSConstants';

const useNetReq = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get base URL from environment or use default
  const baseURL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

  /**
   * Fetch data from API
   * @param {object} config - Request configuration
   * @returns {Promise<object>} - Response data or error
   */
  const fetchData = useCallback(async ({
    url,
    method = 'GET',
    body = null,
    authRequired = true,
    customHeaders = {},
    responseType = 'json',
    timeout = 60000,
    signal = null,
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Build headers
      const headers = {
        'X-Application-Name': 'quizcraft',
        ...customHeaders,
      };

      // Only set Content-Type if body is not FormData
      // FormData will set its own Content-Type with boundary
      if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      // Add authorization token if required
      if (authRequired) {
        const token = getFromLS(LS_CONSTS.LS_ACCESS_TOKEN);
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // Make request
      const config = {
        url: `${baseURL}/${url}`,
        method,
        headers,
        data: body,
        timeout,
        signal,
        responseType,
        withCredentials: true, // Enable credentials for CORS
      };

      const response = await axios(config);

      setLoading(false);
      return { data: response.data };
    } catch (err) {
      setLoading(false);

      // Handle abort error
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        throw err;
      }

      // Parse error response
      // Backend can return error in two formats:
      // 1. String: { error: "email-already-verified", message: "..." }
      // 2. Object: { error: { code: "...", message: "..." } }
      const backendError = err.response?.data?.error;
      const backendMessage = err.response?.data?.message;

      const errorResponse = {
        error: {
          // If error is a string, use it as the error code
          error: typeof backendError === 'string' ? backendError : backendError?.code,
          code: typeof backendError === 'string' ? backendError : backendError?.code || 'unknown-error',
          message:
            backendMessage ||
            backendError?.message ||
            err.message ||
            'An error occurred',
          details: typeof backendError === 'object' ? backendError?.details || {} : {},
        },
      };

      setError(errorResponse.error);
      return errorResponse;
    }
  }, [baseURL]);

  return { loading, error, fetchData };
};

export default useNetReq;
