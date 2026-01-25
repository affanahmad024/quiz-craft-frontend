// Quiz Context Provider
// Global state management for quizzes
// Following Phoenix pattern

import { createContext, useContext, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import useNetReq from '../../hooks/NetworkRequest';
import {
  createQuiz,
  getQuiz,
  getQuizFull,
  listMyQuizzes,
  listPublicQuizzes,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz,
  duplicateQuiz,
  shareQuiz,
  searchQuizzes,
} from '../../services/quiz/QuizServices';
import {
  addQuestion,
  bulkAddQuestions,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
} from '../../services/quiz/QuestionServices';

const QuizCtx = createContext();

/**
 * Quiz Context Provider
 * Manages quiz-related state and operations
 */
function QuizContextProvider({ children }) {
  const { fetchData } = useNetReq();

  // Separate abort controller refs for different operations to prevent interference
  const createQuizAbortRef = useRef(null);
  const getQuizAbortRef = useRef(null);
  const listMyQuizzesAbortRef = useRef(null);
  const listPublicQuizzesAbortRef = useRef(null);
  const updateQuizAbortRef = useRef(null);
  const deleteQuizAbortRef = useRef(null);
  const publishQuizAbortRef = useRef(null);
  const unpublishQuizAbortRef = useRef(null);
  const duplicateQuizAbortRef = useRef(null);
  const shareQuizAbortRef = useRef(null);
  const searchQuizzesAbortRef = useRef(null);
  const addQuestionAbortRef = useRef(null);
  const bulkAddQuestionsAbortRef = useRef(null);
  const updateQuestionAbortRef = useRef(null);
  const deleteQuestionAbortRef = useRef(null);
  const addAnswerAbortRef = useRef(null);
  const updateAnswerAbortRef = useRef(null);
  const deleteAnswerAbortRef = useRef(null);

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [publicQuizzes, setPublicQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Create new quiz
   */
  const handleCreateQuiz = async (quizData) => {
    setIsLoading(true);
    const response = await createQuiz(fetchData, createQuizAbortRef, { quizData });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual quiz
      const quiz = response.data?.data || response.data;
      setCurrentQuiz(quiz);
      // Add to quizzes list
      setQuizzes((prev) => [quiz, ...prev]);
    }

    return response;
  };

  /**
   * Fetch quiz by ID
   */
  const handleGetQuiz = async (quizId, full = false) => {
    setIsLoading(true);
    const response = full
      ? await getQuizFull(fetchData, getQuizAbortRef, { quizId })
      : await getQuiz(fetchData, getQuizAbortRef, { quizId });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual quiz
      setCurrentQuiz(response.data?.data || response.data);
    }

    return response;
  };

  /**
   * Fetch user's quizzes
   */
  const handleListMyQuizzes = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    const response = await listMyQuizzes(fetchData, listMyQuizzesAbortRef, { page, limit });
    setIsLoading(false);

    console.log('listMyQuizzes response:', response);
    console.log('response.data:', response.data);
    console.log('response.data?.data?.quizzes:', response.data?.data?.quizzes);

    if (response.success && response.data?.data?.quizzes) {
      console.log('Setting quizzes to:', response.data.data.quizzes);
      setQuizzes(response.data.data.quizzes);
    } else if (!response.success && !response.aborted) {
      // Only reset to empty array if request failed (not if aborted)
      console.log('Request failed, setting empty array');
      setQuizzes([]);
    }

    return response;
  }, [fetchData]);

  /**
   * Fetch public quizzes
   */
  const handleListPublicQuizzes = async (page = 1, limit = 20) => {
    setIsLoading(true);
    const response = await listPublicQuizzes(fetchData, listPublicQuizzesAbortRef, { page, limit });
    setIsLoading(false);

    if (response.success && response.data?.data?.quizzes) {
      setPublicQuizzes(response.data.data.quizzes);
    }

    return response;
  };

  /**
   * Update quiz
   */
  const handleUpdateQuiz = async (quizId, updates) => {
    setIsLoading(true);
    const response = await updateQuiz(fetchData, updateQuizAbortRef, { quizId, updates });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual quiz
      const quiz = response.data?.data || response.data;
      setCurrentQuiz(quiz);
      // Update in list
      setQuizzes((prev) =>
        prev.map((q) => (q.id === quizId ? quiz : q))
      );
    }

    return response;
  };

  /**
   * Delete quiz
   */
  const handleDeleteQuiz = async (quizId) => {
    setIsLoading(true);
    const response = await deleteQuiz(fetchData, deleteQuizAbortRef, { quizId });
    setIsLoading(false);

    if (response.success) {
      // Remove from list
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      if (currentQuiz?.id === quizId) {
        setCurrentQuiz(null);
      }
    }

    return response;
  };

  /**
   * Publish quiz
   */
  const handlePublishQuiz = async (quizId) => {
    setIsLoading(true);
    const response = await publishQuiz(fetchData, publishQuizAbortRef, { quizId });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual quiz
      const quiz = response.data?.data || response.data;
      setCurrentQuiz(quiz);
      setQuizzes((prev) =>
        prev.map((q) => (q.id === quizId ? quiz : q))
      );
    }

    return response;
  };

  /**
   * Unpublish quiz
   */
  const handleUnpublishQuiz = async (quizId) => {
    setIsLoading(true);
    const response = await unpublishQuiz(fetchData, unpublishQuizAbortRef, { quizId });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual quiz
      const quiz = response.data?.data || response.data;
      setCurrentQuiz(quiz);
      setQuizzes((prev) =>
        prev.map((q) => (q.id === quizId ? quiz : q))
      );
    }

    return response;
  };

  /**
   * Duplicate quiz
   */
  const handleDuplicateQuiz = async (quizId) => {
    setIsLoading(true);
    const response = await duplicateQuiz(fetchData, duplicateQuizAbortRef, { quizId });
    setIsLoading(false);

    if (response.success) {
      // Handle nested data structure: response.data.data contains the actual quiz
      const quiz = response.data?.data || response.data;
      setQuizzes((prev) => [quiz, ...prev]);
    }

    return response;
  };

  /**
   * Share quiz
   */
  const handleShareQuiz = async (quizId) => {
    setIsLoading(true);
    const response = await shareQuiz(fetchData, shareQuizAbortRef, { quizId });
    setIsLoading(false);

    return response;
  };

  /**
   * Search quizzes
   */
  const handleSearchQuizzes = async (query, page = 1, limit = 20) => {
    setIsLoading(true);
    const response = await searchQuizzes(fetchData, searchQuizzesAbortRef, { query, page, limit });
    setIsLoading(false);

    return response;
  };

  /**
   * Add question to quiz
   */
  const handleAddQuestion = async (quizId, questionData) => {
    setIsLoading(true);
    const response = await addQuestion(fetchData, addQuestionAbortRef, { quizId, questionData });
    setIsLoading(false);

    if (response.success && currentQuiz) {
      // Handle nested data structure: response.data.data contains the actual question
      const question = response.data?.data || response.data;
      // Add question to current quiz
      setCurrentQuiz((prev) => ({
        ...prev,
        questions: [...(prev.questions || []), question],
      }));
    }

    return response;
  };

  /**
   * Bulk add questions to quiz
   */
  const handleBulkAddQuestions = async (quizId, questions) => {
    setIsLoading(true);
    const response = await bulkAddQuestions(fetchData, bulkAddQuestionsAbortRef, { quizId, questions });
    setIsLoading(false);

    if (response.success && currentQuiz) {
      // Handle nested data structure: response.data.data contains the array of questions
      const newQuestions = response.data?.data || response.data;
      // Add questions to current quiz
      setCurrentQuiz((prev) => ({
        ...prev,
        questions: [...(prev.questions || []), ...(Array.isArray(newQuestions) ? newQuestions : [])],
      }));
    }

    return response;
  };

  /**
   * Update question
   */
  const handleUpdateQuestion = async (questionId, updates) => {
    setIsLoading(true);
    const response = await updateQuestion(fetchData, updateQuestionAbortRef, { questionId, updates });
    setIsLoading(false);

    if (response.success && currentQuiz) {
      // Handle nested data structure: response.data.data contains the actual question
      const question = response.data?.data || response.data;
      // Update question in current quiz
      setCurrentQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? question : q
        ),
      }));
    }

    return response;
  };

  /**
   * Delete question
   */
  const handleDeleteQuestion = async (questionId) => {
    setIsLoading(true);
    const response = await deleteQuestion(fetchData, deleteQuestionAbortRef, { questionId });
    setIsLoading(false);

    if (response.success && currentQuiz) {
      // Remove question from current quiz
      setCurrentQuiz((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
      }));
    }

    return response;
  };

  /**
   * Add answer to question
   */
  const handleAddAnswer = async (questionId, answerData) => {
    setIsLoading(true);
    const response = await addAnswer(fetchData, addAnswerAbortRef, { questionId, answerData });
    setIsLoading(false);

    if (response.success && currentQuiz) {
      // Handle nested data structure: response.data.data contains the actual answer
      const answer = response.data?.data || response.data;
      // Add answer to question
      setCurrentQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? { ...q, answers: [...(q.answers || []), answer] }
            : q
        ),
      }));
    }

    return response;
  };

  /**
   * Update answer
   */
  const handleUpdateAnswer = async (answerId, updates) => {
    setIsLoading(true);
    const response = await updateAnswer(fetchData, updateAnswerAbortRef, { answerId, updates });
    setIsLoading(false);

    if (response.success && currentQuiz) {
      // Handle nested data structure: response.data.data contains the actual answer
      const answer = response.data?.data || response.data;
      // Update answer in question
      setCurrentQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => ({
          ...q,
          answers: q.answers?.map((a) => (a.id === answerId ? answer : a)),
        })),
      }));
    }

    return response;
  };

  /**
   * Delete answer
   */
  const handleDeleteAnswer = async (answerId) => {
    setIsLoading(true);
    const response = await deleteAnswer(fetchData, deleteAnswerAbortRef, { answerId });
    setIsLoading(false);

    if (response.success && currentQuiz) {
      // Remove answer from question
      setCurrentQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => ({
          ...q,
          answers: q.answers?.filter((a) => a.id !== answerId),
        })),
      }));
    }

    return response;
  };

  /**
   * Clear current quiz
   */
  const clearCurrentQuiz = () => {
    setCurrentQuiz(null);
  };

  const value = {
    currentQuiz,
    quizzes,
    publicQuizzes,
    isLoading,
    createQuiz: handleCreateQuiz,
    getQuiz: handleGetQuiz,
    listMyQuizzes: handleListMyQuizzes,
    listPublicQuizzes: handleListPublicQuizzes,
    updateQuiz: handleUpdateQuiz,
    deleteQuiz: handleDeleteQuiz,
    publishQuiz: handlePublishQuiz,
    unpublishQuiz: handleUnpublishQuiz,
    duplicateQuiz: handleDuplicateQuiz,
    shareQuiz: handleShareQuiz,
    searchQuizzes: handleSearchQuizzes,
    addQuestion: handleAddQuestion,
    bulkAddQuestions: handleBulkAddQuestions,
    updateQuestion: handleUpdateQuestion,
    deleteQuestion: handleDeleteQuestion,
    addAnswer: handleAddAnswer,
    updateAnswer: handleUpdateAnswer,
    deleteAnswer: handleDeleteAnswer,
    clearCurrentQuiz,
  };

  return <QuizCtx.Provider value={value}>{children}</QuizCtx.Provider>;
}

QuizContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use Quiz Context
 */
export const useQuiz = () => {
  const context = useContext(QuizCtx);
  if (!context) {
    throw new Error('useQuiz must be used within QuizContextProvider');
  }
  return context;
};

export default QuizContextProvider;
