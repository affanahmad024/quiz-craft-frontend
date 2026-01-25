// Profile Context Provider
// Global state management for user profile
// Following Phoenix pattern

import { createContext, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useNetReq from '../../hooks/NetworkRequest';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUserStatistics,
} from '../../services/profile/ProfileServices';

const ProfileCtx = createContext();

/**
 * Profile Context Provider
 * Manages user profile and statistics state
 */
function ProfileContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const abortContRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Get user profile
   */
  const handleGetProfile = async () => {
    setIsLoading(true);
    const response = await getUserProfile(fetchData, abortContRef);
    setIsLoading(false);

    if (response.success) {
      setProfile(response.data?.data || response.data);
    }

    return response;
  };

  /**
   * Update user profile
   */
  const handleUpdateProfile = async (updates) => {
    setIsLoading(true);
    const response = await updateUserProfile(fetchData, abortContRef, { updates });
    setIsLoading(false);

    if (response.success) {
      setProfile(response.data?.data || response.data);
    }

    return response;
  };

  /**
   * Delete user account
   */
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    const response = await deleteUserAccount(fetchData, abortContRef);
    setIsLoading(false);

    return response;
  };

  /**
   * Get user statistics
   */
  const handleGetStatistics = async () => {
    setIsLoading(true);
    const response = await getUserStatistics(fetchData, abortContRef);
    setIsLoading(false);

    console.log('Statistics Response:', response);
    console.log('Response Data:', response.data);

    if (response.success) {
      const data = response.data?.data || response.data;
      console.log('Extracted Statistics:', data);
      setStatistics(data);
    }

    return response;
  };

  /**
   * Clear profile data
   */
  const clearProfile = () => {
    setProfile(null);
    setStatistics(null);
  };

  const value = {
    profile,
    statistics,
    isLoading,
    getProfile: handleGetProfile,
    updateProfile: handleUpdateProfile,
    deleteAccount: handleDeleteAccount,
    getStatistics: handleGetStatistics,
    clearProfile,
  };

  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>;
}

ProfileContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use Profile Context
 */
export const useProfile = () => {
  const context = useContext(ProfileCtx);
  if (!context) {
    throw new Error('useProfile must be used within ProfileContextProvider');
  }
  return context;
};

export default ProfileContextProvider;
