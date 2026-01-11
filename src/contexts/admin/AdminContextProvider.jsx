// Admin Context Provider
// Global state management for admin operations
// Following Phoenix pattern

import { createContext, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useNetReq from '../../hooks/NetworkRequest';
import {
  listUsers,
  getUserDetails,
  changeUserRole,
  disableUser,
  enableUser,
  deleteUser,
  listQuizzes,
  getQuizDetails,
  deleteQuiz,
  getPlatformStats,
  getActivityTimeline,
  getActivityLogs,
} from '../../services/admin/AdminServices';

const AdminCtx = createContext();

/**
 * Admin Context Provider
 * Manages admin operations and state
 */
function AdminContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const abortContRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ============ User Management ============

  const handleListUsers = async (params) => {
    setIsLoading(true);
    const response = await listUsers(fetchData, abortContRef, params);
    setIsLoading(false);

    if (response.success) {
      setUsers(response.data.users);
    }

    return response;
  };

  const handleGetUserDetails = async (userId) => {
    setIsLoading(true);
    const response = await getUserDetails(fetchData, abortContRef, { userId });
    setIsLoading(false);

    return response;
  };

  const handleChangeUserRole = async (userId, role) => {
    const response = await changeUserRole(fetchData, abortContRef, { userId, role });

    if (response.success) {
      // Update user in list
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    }

    return response;
  };

  const handleDisableUser = async (userId, reason) => {
    const response = await disableUser(fetchData, abortContRef, { userId, reason });

    if (response.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, enabled: false } : u))
      );
    }

    return response;
  };

  const handleEnableUser = async (userId) => {
    const response = await enableUser(fetchData, abortContRef, { userId });

    if (response.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, enabled: true } : u))
      );
    }

    return response;
  };

  const handleDeleteUser = async (userId, reason, permanent) => {
    const response = await deleteUser(fetchData, abortContRef, { userId, reason, permanent });

    if (response.success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }

    return response;
  };

  // ============ Quiz Management ============

  const handleListQuizzes = async (params) => {
    setIsLoading(true);
    const response = await listQuizzes(fetchData, abortContRef, params);
    setIsLoading(false);

    if (response.success) {
      setQuizzes(response.data.quizzes);
    }

    return response;
  };

  const handleGetQuizDetails = async (quizId) => {
    setIsLoading(true);
    const response = await getQuizDetails(fetchData, abortContRef, { quizId });
    setIsLoading(false);

    return response;
  };

  const handleDeleteQuiz = async (quizId, reason, permanent) => {
    const response = await deleteQuiz(fetchData, abortContRef, { quizId, reason, permanent });

    if (response.success) {
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    }

    return response;
  };

  // ============ Statistics ============

  const handleGetPlatformStats = async () => {
    setIsLoading(true);
    const response = await getPlatformStats(fetchData, abortContRef);
    setIsLoading(false);

    if (response.success) {
      setPlatformStats(response.data);
    }

    return response;
  };

  const handleGetActivityTimeline = async (days) => {
    setIsLoading(true);
    const response = await getActivityTimeline(fetchData, abortContRef, { days });
    setIsLoading(false);

    if (response.success) {
      setActivityTimeline(response.data.activity);
    }

    return response;
  };

  const handleGetActivityLogs = async (params) => {
    setIsLoading(true);
    const response = await getActivityLogs(fetchData, abortContRef, params);
    setIsLoading(false);

    return response;
  };

  const value = {
    users,
    quizzes,
    platformStats,
    activityTimeline,
    isLoading,
    listUsers: handleListUsers,
    getUserDetails: handleGetUserDetails,
    changeUserRole: handleChangeUserRole,
    disableUser: handleDisableUser,
    enableUser: handleEnableUser,
    deleteUser: handleDeleteUser,
    listQuizzes: handleListQuizzes,
    getQuizDetails: handleGetQuizDetails,
    deleteQuiz: handleDeleteQuiz,
    getPlatformStats: handleGetPlatformStats,
    getActivityTimeline: handleGetActivityTimeline,
    getActivityLogs: handleGetActivityLogs,
  };

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

AdminContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use Admin Context
 */
export const useAdmin = () => {
  const context = useContext(AdminCtx);
  if (!context) {
    throw new Error('useAdmin must be used within AdminContextProvider');
  }
  return context;
};

export default AdminContextProvider;
