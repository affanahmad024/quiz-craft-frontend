// Live Session API Endpoints
// Following Phoenix pattern for centralized endpoint definitions

import { API_METHODS } from "../APIMethods";

export const LIVE_SESSION_ENDPOINTS = {
  // Session Management
  CREATE_SESSION: {
    url: "api/v1/live-sessions",
    method: API_METHODS.POST,
  },

  GET_SESSION: {
    url: (id) => `live-sessions/${id}`,
    method: API_METHODS.GET,
  },

  GET_SESSION_QUESTIONS: {
    url: (id) => `live-sessions/${id}/questions`,
    method: API_METHODS.GET,
  },

  GET_MY_SESSIONS: {
    url: "api/v1/live-sessions",
    method: API_METHODS.GET,
  },

  GET_PUBLIC_SESSIONS: {
    url: "api/v1/live-sessions/public",
    method: API_METHODS.GET,
  },

  START_SESSION: {
    url: (id) => `live-sessions/${id}/start`,
    method: API_METHODS.POST,
  },

  ADVANCE_QUESTION: {
    url: (id) => `live-sessions/${id}/advance`,
    method: API_METHODS.POST,
  },

  END_SESSION: {
    url: (id) => `live-sessions/${id}/end`,
    method: API_METHODS.POST,
  },

  // Participation
  JOIN_SESSION: {
    url: (id) => `live-sessions/${id}/join`,
    method: API_METHODS.POST,
  },

  SUBMIT_ANSWER: {
    url: (id) => `live-sessions/${id}/answer`,
    method: API_METHODS.POST,
  },

  LEAVE_SESSION: {
    url: (id) => `live-sessions/${id}/leave`,
    method: API_METHODS.POST,
  },

  // Data Retrieval
  GET_LEADERBOARD: {
    url: (id) => `live-sessions/${id}/leaderboard`,
    method: API_METHODS.GET,
  },

  GET_RESULTS: {
    url: (id) => `live-sessions/${id}/results`,
    method: API_METHODS.GET,
  },

  // Invitations
  INVITE_USERS: {
    url: (id) => `live-sessions/${id}/invite`,
    method: API_METHODS.POST,
  },

  GET_INVITATIONS: {
    url: "api/v1/live-sessions/invitations",
    method: API_METHODS.GET,
  },

  // WebSocket
  WS_SESSION: {
    url: (id) => `live-sessions/${id}/ws`,
    method: "WS",
  },
};
