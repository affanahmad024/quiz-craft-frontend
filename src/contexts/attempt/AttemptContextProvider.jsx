// Attempt Context Provider
// Global state management for quiz attempts
// Following Phoenix pattern

import { createContext, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useNetReq from '../../hooks/NetworkRequest';
import {
  startAttempt,
  getAttempt,
  submitAnswer,
  finishAttempt,
  getAttemptResults,
  listMyAttempts,
} from '../../services/attempt/AttemptServices';

const AttemptCtx = createContext();

/**
 * Attempt Context Provider
 * Manages quiz attempt state and operations
 */
function AttemptContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const abortContRef = useRef(null);

  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [currentResults, setCurrentResults] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Start new quiz attempt
   */
  const handleStartAttempt = async (quizId) => {
    setIsLoading(true);
    const response = await startAttempt(fetchData, abortContRef, { quizId });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual attempt
      const attempt = response.data?.data || response.data;
      setCurrentAttempt(attempt);
      setUserAnswers({});
    }

    return response;
  };

  /**
   * Get attempt by ID
   */
  const handleGetAttempt = async (attemptId) => {
    setIsLoading(true);
    const response = await getAttempt(fetchData, abortContRef, { attemptId });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual attempt
      const attempt = response.data?.data || response.data;
      setCurrentAttempt(attempt);
    }

    return response;
  };

  /**
   * Submit answer for a question
   */
  const handleSubmitAnswer = async (attemptId, questionId, answerId, answerText) => {
    const response = await submitAnswer(fetchData, abortContRef, {
      attemptId,
      questionId,
      answerId,
      answerText,
    });

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual answer result
      const answerResult = response.data?.data || response.data;
      // Update local answer state
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: {
          answerId,
          answerText,
          isCorrect: answerResult.is_correct,
          pointsEarned: answerResult.points_earned,
        },
      }));
    }

    return response;
  };

  /**
   * Finish attempt
   */
  const handleFinishAttempt = async (attemptId) => {
    setIsLoading(true);
    const response = await finishAttempt(fetchData, abortContRef, { attemptId });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual attempt
      const attempt = response.data?.data || response.data;
      setCurrentAttempt(attempt);
    }

    return response;
  };

  /**
   * Get attempt results
   */
  const handleGetAttemptResults = async (attemptId) => {
    console.log('[AttemptContext] Getting results for attempt:', attemptId);
    setIsLoading(true);
    const response = await getAttemptResults(fetchData, abortContRef, { attemptId });
    setIsLoading(false);

    console.log('[AttemptContext] Results API response:', {
      success: response.success,
      hasData: !!response.data,
      dataStructure: response.data ? Object.keys(response.data) : []
    });

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual results
      const results = response.data?.data || response.data;

      console.log('[AttemptContext] Setting current results:', {
        id: results.id,
        score: results.score,
        maxScore: results.max_score,
        answersCount: results.answers?.length || 0
      });

      setCurrentResults(results);
    } else {
      console.error('[AttemptContext] Failed to get results:', response.error);
    }

    return response;
  };

  /**
   * List user's attempts
   */
  const handleListMyAttempts = async (page = 1, limit = 20, quizId, status) => {
    setIsLoading(true);
    const response = await listMyAttempts(fetchData, abortContRef, {
      page,
      limit,
      quizId,
      status,
    });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data.attempts contains the actual attempts
      const attempts = response.data?.data?.attempts || response.data?.attempts || [];
      setAttempts(attempts);
    }

    return response;
  };

  /**
   * Clear current attempt
   */
  const clearCurrentAttempt = () => {
    setCurrentAttempt(null);
    setUserAnswers({});
  };

  /**
   * Clear current results
   */
  const clearCurrentResults = () => {
    setCurrentResults(null);
  };

  const value = {
    currentAttempt,
    currentResults,
    attempts,
    userAnswers,
    isLoading,
    startAttempt: handleStartAttempt,
    getAttempt: handleGetAttempt,
    submitAnswer: handleSubmitAnswer,
    finishAttempt: handleFinishAttempt,
    getAttemptResults: handleGetAttemptResults,
    listMyAttempts: handleListMyAttempts,
    clearCurrentAttempt,
    clearCurrentResults,
  };

  return <AttemptCtx.Provider value={value}>{children}</AttemptCtx.Provider>;
}

AttemptContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use Attempt Context
 */
export const useAttempt = () => {
  const context = useContext(AttemptCtx);
  if (!context) {
    throw new Error('useAttempt must be used within AttemptContextProvider');
  }
  return context;
};

export default AttemptContextProvider;
