// File Services
// Service layer for file operations
// Following Phoenix pattern

import { FILE_ENDPOINTS } from '../../api/file/FileEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Upload file
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { formData }
 * @returns {Promise} Uploaded file metadata
 */
export const uploadFile = (fetchData, abortContRef, { formData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: FILE_ENDPOINTS.UPLOAD_FILE,
    payload: formData,
    authRequired: true,
    defaultErrorMsg: "Couldn't upload file.",
    isFormData: true, // Special flag for multipart/form-data
  });

/**
 * Get file by ID
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { fileId }
 * @returns {Promise} File metadata
 */
export const getFile = (fetchData, abortContRef, { fileId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: FILE_ENDPOINTS.GET_FILE,
    urlKeys: { id: fileId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch file.",
  });

/**
 * Delete file
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { fileId }
 * @returns {Promise} Deletion response
 */
export const deleteFile = (fetchData, abortContRef, { fileId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: FILE_ENDPOINTS.DELETE_FILE,
    urlKeys: { id: fileId },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete file.",
  });

/**
 * Get file serve URL
 * @param {string} fileId - File ID
 * @returns {string} File serve URL
 */
export const getFileServeUrl = (fileId) => {
  // Assuming API base URL from environment or config
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  return `${apiBase}/files/serve/${fileId}`;
};
