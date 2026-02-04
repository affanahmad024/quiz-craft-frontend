// Minimal educator services using existing fetchWithAbort pattern
import { fetchWithAbort } from "../CommonFetch";

const BASE = "educator";

export const promoteToEducator = (fetchData, abortContRef, { profileData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: { url: `${BASE}/promote`, method: "POST" },
    payload: profileData,
    authRequired: true,
    defaultErrorMsg: "Couldn't promote to educator",
    showSuccessToast: true,
    successMsg: "You are now an educator!",
  });

export const getMyEducatorProfile = (fetchData, abortContRef) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: { url: `${BASE}/profile`, method: "GET" },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch educator profile",
  });

export const updateEducatorProfile = (fetchData, abortContRef, { payload }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: { url: `${BASE}/profile`, method: "PATCH" },
    payload,
    authRequired: true,
    defaultErrorMsg: "Couldn't update profile",
    showSuccessToast: true,
  });

export const getEducators = (fetchData, abortContRef, params = {}) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: { url: `educators`, method: "GET" },
    dynamicQparams: params,
    authRequired: false,
    defaultErrorMsg: "Couldn't fetch educators",
  });

export const getEducatorProfile = (fetchData, abortContRef, { id }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: { url: `educators/${id}`, method: "GET" },
    authRequired: false,
    defaultErrorMsg: "Couldn't fetch educator",
  });

export const followEducator = (fetchData, abortContRef, { id }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: { url: `educators/${id}/follow`, method: "POST" },
    authRequired: true,
    defaultErrorMsg: "Couldn't follow educator",
    showSuccessToast: true,
  });

export const unfollowEducator = (fetchData, abortContRef, { id }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: { url: `educators/${id}/unfollow`, method: "DELETE" },
    authRequired: true,
    defaultErrorMsg: "Couldn't unfollow educator",
    showSuccessToast: true,
  });

export const getFollowers = (fetchData, abortContRef, params = {}) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: { url: `educator/followers`, method: "GET" },
    dynamicQparams: params,
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch followers",
  });
