// Question Services
// Service layer for question and answer operations
// Following Phoenix pattern

import { QUESTION_ENDPOINTS } from '../../api/quiz/QuestionEndpoints';
import { fetchWithAbort } from '../CommonFetch';

/**
 * Add question to quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId, questionData }
 * @returns {Promise} Created question
 */
export const addQuestion = (fetchData, abortContRef, { quizId, questionData }) => {
  // Check if question has an image file
  const hasImageFile = questionData.image_file instanceof File;

  // If there's an image file, prepare FormData
  let payload = questionData;
  let isFormData = false;

  if (hasImageFile) {
    const formData = new FormData();

    // Append the image file
    formData.append('image', questionData.image_file);

    // Append other question data as JSON string
    const questionDataWithoutFile = { ...questionData };
    delete questionDataWithoutFile.image_file;
    formData.append('question_data', JSON.stringify(questionDataWithoutFile));

    payload = formData;
    isFormData = true;
  }

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.ADD_QUESTION,
    urlKeys: { id: quizId },
    payload,
    authRequired: true,
    defaultErrorMsg: "Couldn't add question.",
    isFormData,
  });
};

/**
 * Bulk add questions to quiz
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { quizId, questions }
 * @returns {Promise} Created questions
 */
export const bulkAddQuestions = (fetchData, abortContRef, { quizId, questions }) => {
  // Check if any question has an image file
  const hasAnyImageFile = questions.some(q => q.image_file instanceof File);

  let payload = { questions };
  let isFormData = false;

  if (hasAnyImageFile) {
    const formData = new FormData();

    // Prepare questions data and append image files
    const questionsDataArray = questions.map((q, index) => {
      const questionData = { ...q };

      // If this question has an image file, append it with a unique key
      if (q.image_file instanceof File) {
        formData.append(`image_${index}`, q.image_file);
        // Mark the question with the image index
        questionData.image_index = index;
        delete questionData.image_file;
      } else {
        delete questionData.image_file;
      }

      return questionData;
    });

    // Append questions data as JSON
    formData.append('questions_data', JSON.stringify(questionsDataArray));

    payload = formData;
    isFormData = true;
  }

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.BULK_ADD_QUESTIONS,
    urlKeys: { id: quizId },
    payload,
    authRequired: true,
    defaultErrorMsg: "Couldn't add questions.",
    isFormData,
  });
};

/**
 * Get question by ID
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { questionId }
 * @returns {Promise} Question details
 */
export const getQuestion = (fetchData, abortContRef, { questionId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.GET_QUESTION,
    urlKeys: { qid: questionId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch question.",
  });

/**
 * Update question
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { questionId, updates }
 * @returns {Promise} Updated question
 */
export const updateQuestion = (fetchData, abortContRef, { questionId, updates }) => {
  // Check if updates include an image file
  const hasImageFile = updates.image_file instanceof File;

  let payload = updates;
  let isFormData = false;

  if (hasImageFile) {
    const formData = new FormData();

    // Append the image file
    formData.append('image', updates.image_file);

    // Append other update data as JSON string
    const updatesWithoutFile = { ...updates };
    delete updatesWithoutFile.image_file;
    formData.append('question_data', JSON.stringify(updatesWithoutFile));

    payload = formData;
    isFormData = true;
  }

  return fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.UPDATE_QUESTION,
    urlKeys: { qid: questionId },
    payload,
    authRequired: true,
    defaultErrorMsg: "Couldn't update question.",
    isFormData,
  });
};

/**
 * Delete question
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { questionId }
 * @returns {Promise} Deletion response
 */
export const deleteQuestion = (fetchData, abortContRef, { questionId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.DELETE_QUESTION,
    urlKeys: { qid: questionId },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete question.",
  });

/**
 * Add answer to question
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { questionId, answerData }
 * @returns {Promise} Created answer
 */
export const addAnswer = (fetchData, abortContRef, { questionId, answerData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.ADD_ANSWER,
    urlKeys: { qid: questionId },
    payload: answerData,
    authRequired: true,
    defaultErrorMsg: "Couldn't add answer.",
  });

/**
 * Update answer
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { answerId, updates }
 * @returns {Promise} Updated answer
 */
export const updateAnswer = (fetchData, abortContRef, { answerId, updates }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.UPDATE_ANSWER,
    urlKeys: { aid: answerId },
    payload: updates,
    authRequired: true,
    defaultErrorMsg: "Couldn't update answer.",
  });

/**
 * Delete answer
 * @param {Function} fetchData - Network request function
 * @param {Object} abortContRef - AbortController reference
 * @param {Object} params - { answerId }
 * @returns {Promise} Deletion response
 */
export const deleteAnswer = (fetchData, abortContRef, { answerId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.DELETE_ANSWER,
    urlKeys: { aid: answerId },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete answer.",
  });

export const listSections = (fetchData, abortContRef, { quizId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.LIST_SECTIONS,
    urlKeys: { id: quizId },
    authRequired: true,
    defaultErrorMsg: "Couldn't fetch sections.",
  });

export const createSection = (fetchData, abortContRef, { quizId, sectionData }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.CREATE_SECTION,
    urlKeys: { id: quizId },
    payload: sectionData,
    authRequired: true,
    defaultErrorMsg: "Couldn't create section.",
  });

export const updateSection = (fetchData, abortContRef, { quizId, sectionId, updates }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.UPDATE_SECTION,
    urlKeys: { id: quizId, sid: sectionId },
    payload: updates,
    authRequired: true,
    defaultErrorMsg: "Couldn't update section.",
  });

export const deleteSection = (fetchData, abortContRef, { quizId, sectionId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.DELETE_SECTION,
    urlKeys: { id: quizId, sid: sectionId },
    authRequired: true,
    defaultErrorMsg: "Couldn't delete section.",
  });

export const reorderSections = (fetchData, abortContRef, { quizId, sections }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.REORDER_SECTIONS,
    urlKeys: { id: quizId },
    payload: { sections },
    authRequired: true,
    defaultErrorMsg: "Couldn't reorder sections.",
  });

export const reorderQuestions = (fetchData, abortContRef, { quizId, questions }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.REORDER_QUESTIONS,
    urlKeys: { id: quizId },
    payload: { questions },
    authRequired: true,
    defaultErrorMsg: "Couldn't reorder questions.",
  });

export const moveQuestionToSection = (fetchData, abortContRef, { questionId, sectionId }) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUESTION_ENDPOINTS.MOVE_QUESTION_TO_SECTION,
    urlKeys: { qid: questionId },
    payload: { section_id: sectionId },
    authRequired: true,
    defaultErrorMsg: "Couldn't move question.",
  });
