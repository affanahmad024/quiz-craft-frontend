// Admin API Endpoints
// Following Phoenix pattern

import { API_METHODS } from "../APIMethods";

/**
 * Admin Management API Endpoints
 * All endpoints require admin role
 */
export const ADMIN_ENDPOINTS = {
  // User Management
  LIST_USERS: {
    url: "api/v1/admin/users",
    method: API_METHODS.GET,
  },
  GET_USER_DETAILS: {
    url: "api/v1/admin/users/:id",
    method: API_METHODS.GET,
  },
  CHANGE_USER_ROLE: {
    url: "api/v1/admin/users/:id/role",
    method: API_METHODS.PATCH,
  },
  DISABLE_USER: {
    url: "api/v1/admin/users/:id/disable",
    method: API_METHODS.POST,
  },
  ENABLE_USER: {
    url: "api/v1/admin/users/:id/enable",
    method: API_METHODS.POST,
  },
  DELETE_USER: {
    url: "api/v1/admin/users/:id",
    method: API_METHODS.DELETE,
  },

  // Quiz Management
  LIST_QUIZZES: {
    url: "api/v1/admin/quizzes",
    method: API_METHODS.GET,
  },
  GET_QUIZ_DETAILS: {
    url: "api/v1/admin/quizzes/:id",
    method: API_METHODS.GET,
  },
  DELETE_QUIZ: {
    url: "api/v1/admin/quizzes/:id",
    method: API_METHODS.DELETE,
  },

  // Statistics
  GET_PLATFORM_STATS: {
    url: "api/v1/admin/stats",
    method: API_METHODS.GET,
  },
  GET_ACTIVITY_TIMELINE: {
    url: "api/v1/admin/stats/activity",
    method: API_METHODS.GET,
  },
  GET_ACTIVITY_LOGS: {
    url: "api/v1/admin/logs",
    method: API_METHODS.GET,
  },
};
