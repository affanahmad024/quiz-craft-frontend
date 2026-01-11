// Auth Context Provider
// Following Phoenix pattern for authentication state management

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useNetReq from '../../hooks/NetworkRequest';
import { loginUser, logoutUser, refreshAccessToken } from '../../services/auth/AuthServices';
import { getFromLS, saveToLS, removeFromLS } from '../../funcs/LSFuncs';
import { LS_CONSTS } from '../../constants/LSConstants';
import { isTokenExpired } from '../../funcs/TokenFuncs';
import toast from 'react-hot-toast';

const AuthCtx = createContext();

function AuthContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  // State
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    getFromLS(LS_CONSTS.LS_ACCESS_TOKEN)
  );
  const [refreshToken, setRefreshToken] = useState(
    getFromLS(LS_CONSTS.LS_REFRESH_TOKEN)
  );

  /**
   * Login function
   * @param {object} credentials - Email and password
   * @returns {Promise<boolean>} - Success status
   */
  const login = async (credentials) => {
    try {
      const response = await loginUser(fetchData, abortContRef, { credentials });

      if (response.success && response.data) {
        const { user: userData, access_token, refresh_token } = response.data;

        // Save tokens and user data
        setUser(userData);
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setIsAuthenticated(true);

        saveToLS(LS_CONSTS.LS_USER_DATA, userData);
        saveToLS(LS_CONSTS.LS_ACCESS_TOKEN, access_token);
        saveToLS(LS_CONSTS.LS_REFRESH_TOKEN, refresh_token);

        toast.success('Login successful!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      // Call logout API (optional - server-side token invalidation)
      await logoutUser(fetchData, abortContRef);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);

      removeFromLS(LS_CONSTS.LS_USER_DATA);
      removeFromLS(LS_CONSTS.LS_ACCESS_TOKEN);
      removeFromLS(LS_CONSTS.LS_REFRESH_TOKEN);
    }
  };

  /**
   * Refresh access token using refresh token
   * @returns {Promise<boolean>} - Success status
   */
  const refreshToken = async () => {
    try {
      const currentRefreshToken = getFromLS(LS_CONSTS.LS_REFRESH_TOKEN);

      if (!currentRefreshToken) {
        return false;
      }

      const response = await refreshAccessToken(fetchData, abortContRef, {
        refreshToken: currentRefreshToken,
      });

      if (response.success && response.data) {
        const { access_token, user: userData } = response.data;

        setAccessToken(access_token);
        setUser(userData);
        saveToLS(LS_CONSTS.LS_ACCESS_TOKEN, access_token);
        saveToLS(LS_CONSTS.LS_USER_DATA, userData);

        return true;
      }

      // Refresh failed - logout user
      await logout();
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  };

  /**
   * Update user data
   * @param {object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(userData);
    saveToLS(LS_CONSTS.LS_USER_DATA, userData);
  };

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  /**
   * Check if email is verified
   * @returns {boolean}
   */
  const isEmailVerified = () => {
    return user?.email_verified === true;
  };

  // Load user on mount and check token expiration
  useEffect(() => {
    const loadUser = async () => {
      const token = getFromLS(LS_CONSTS.LS_ACCESS_TOKEN);
      const userData = getFromLS(LS_CONSTS.LS_USER_DATA);
      const storedRefreshToken = getFromLS(LS_CONSTS.LS_REFRESH_TOKEN);

      if (token && userData && storedRefreshToken) {
        // Check if access token is expired
        if (isTokenExpired(token)) {
          // Try to refresh
          const refreshed = await refreshToken();
          if (!refreshed) {
            // Refresh failed, logout
            await logout();
          }
        } else {
          // Token still valid
          setAccessToken(token);
          setRefreshToken(storedRefreshToken);
          setUser(userData);
          setIsAuthenticated(true);
        }
      }

      setIsLoading(false);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh token before expiration (5 minutes before)
  useEffect(() => {
    if (!accessToken || !isAuthenticated) return;

    const checkTokenExpiration = setInterval(() => {
      if (isTokenExpired(accessToken)) {
        refreshToken();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(checkTokenExpiration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isAuthenticated]);

  const value = {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    accessToken,
    refreshToken: refreshToken,
    login,
    logout,
    refreshAccessToken: refreshToken,
    updateUser,
    isAdmin,
    isEmailVerified,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to use auth context
 * @returns {object} Auth context value
 */
const useAuth = () => {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }
  return context;
};

export { AuthContextProvider, useAuth };
