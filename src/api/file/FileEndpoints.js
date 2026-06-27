// File API Endpoints
// Following Phoenix pattern

import { API_METHODS } from "../APIMethods";

/**
 * File Management API Endpoints
 */
export const FILE_ENDPOINTS = {
  // Upload file
  UPLOAD_FILE: {
    url: "api/v1/files/upload",
    method: API_METHODS.POST,
  },

  // Get file by ID
  GET_FILE: {
    url: "api/v1/files/:id",
    method: API_METHODS.GET,
  },

  // Delete file
  DELETE_FILE: {
    url: "api/v1/files/:id",
    method: API_METHODS.DELETE,
  },

  // Serve file (public URL)
  SERVE_FILE: {
    url: "api/v1/files/serve/:id",
    method: API_METHODS.GET,
  },
};
