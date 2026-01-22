// Discovery Context Provider
// Global state management for search and discovery
// Following Phoenix pattern

import { createContext, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useNetReq from '../../hooks/NetworkRequest';
import {
  searchQuizzes,
  getCategories,
  getTags,
  getQuizByShareCode,
  getQuizStats,
  getQuizStatistics,
} from '../../services/discovery/DiscoveryServices';

const DiscoveryCtx = createContext();

/**
 * Discovery Context Provider
 * Manages search, discovery, and statistics state
 */
function DiscoveryContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const abortContRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [quizStats, setQuizStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMeta, setSearchMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  /**
   * Search quizzes
   */
  const handleSearchQuizzes = async (searchParams) => {
    setIsLoading(true);
    const response = await searchQuizzes(fetchData, abortContRef, searchParams);
    setIsLoading(false);

    if (response.success) {
      setSearchResults(response.data.quizzes || []);
      setSearchMeta({
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 20,
        totalPages: response.data.total_pages || 0,
      });
    }

    return response;
  };

  /**
   * Get categories
   */
  const handleGetCategories = async () => {
    setIsLoading(true);
    const response = await getCategories(fetchData, abortContRef);
    setIsLoading(false);

    if (response.success) {
      setCategories(response.data?.data || response.data.categories);
    }

    return response;
  };

  /**
   * Get tags
   */
  const handleGetTags = async () => {
    setIsLoading(true);
    const response = await getTags(fetchData, abortContRef);
    setIsLoading(false);

    if (response.success) {
      setTags(response.data?.data || response.data.tags);
    }

    return response;
  };

  /**
   * Get quiz by share code
   */
  const handleGetQuizByShareCode = async (shareCode) => {
    setIsLoading(true);
    const response = await getQuizByShareCode(fetchData, abortContRef, { shareCode });
    setIsLoading(false);

    return response;
  };

  /**
   * Get quiz statistics
   */
  const handleGetQuizStats = async (quizId) => {
    setIsLoading(true);
    const response = await getQuizStats(fetchData, abortContRef, { quizId });
    setIsLoading(false);

    if (response.success) {
      setQuizStats(response.data?.data || response.data);
    }

    return response;
  };

  /**
   * Get detailed quiz statistics
   */
  const handleGetQuizStatistics = async (quizId) => {
    setIsLoading(true);
    const response = await getQuizStatistics(fetchData, abortContRef, { quizId });
    setIsLoading(false);

    if (response.success) {
      setQuizStats(response.data?.data || response.data);
    }

    return response;
  };

  /**
   * Clear search results
   */
  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchMeta({
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });
  };

  const value = {
    searchResults,
    categories,
    tags,
    quizStats,
    searchMeta,
    isLoading,
    searchQuizzes: handleSearchQuizzes,
    getCategories: handleGetCategories,
    getTags: handleGetTags,
    getQuizByShareCode: handleGetQuizByShareCode,
    getQuizStats: handleGetQuizStats,
    getQuizStatistics: handleGetQuizStatistics,
    clearSearchResults,
  };

  return <DiscoveryCtx.Provider value={value}>{children}</DiscoveryCtx.Provider>;
}

DiscoveryContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use Discovery Context
 */
export const useDiscovery = () => {
  const context = useContext(DiscoveryCtx);
  if (!context) {
    throw new Error('useDiscovery must be used within DiscoveryContextProvider');
  }
  return context;
};

export default DiscoveryContextProvider;
