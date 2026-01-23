// Question Form Bulk Component
// Full-screen dialog for adding multiple questions at once
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import QuizCraftButton from '../buttons/QuizCraftButton';
import QuestionFormFields from './QuestionFormFields';
import {
  QUESTION_TYPE_LABELS,
  QUIZ_VALIDATION,
  MIN_ANSWERS_REQUIRED,
} from '../../constants/QuizConstants';

/**
 * QuestionFormBulk Component
 * Full-screen dialog for adding multiple questions at once
 * @param {boolean} open - Whether dialog is open
 * @param {function} onClose - Callback to close dialog
 * @param {function} onSubmit - Callback when questions are submitted
 * @param {string} questionType - Type of questions (pre-selected)
 * @param {number} count - Number of question slots (default 10)
 * @param {boolean} isLoading - Loading state
 */
function QuestionFormBulk({ open, onClose, onSubmit, questionType, count, isLoading }) {
  // Initialize default answers based on question type
  const getDefaultAnswers = (type) => {
    if (type === 'true_false') {
      return [
        { answer_text: 'True', is_correct: false, order_index: 0 },
        { answer_text: 'False', is_correct: false, order_index: 1 },
      ];
    } else if (type === 'multiple_choice') {
      return [
        { answer_text: '', is_correct: false, order_index: 0 },
        { answer_text: '', is_correct: false, order_index: 1 },
      ];
    }
    return [];
  };

  // Initialize questions array
  const initializeQuestions = () => {
    return Array(count)
      .fill(null)
      .map((_, index) => ({
        id: index,
        question_text: '',
        points: 1,
        explanation: '',
        image_file: null,
        answers: getDefaultAnswers(questionType),
        expanded: index === 0, // First one expanded by default
      }));
  };

  const [questions, setQuestions] = useState(initializeQuestions());

  // Reset questions when dialog opens or question type changes
  useEffect(() => {
    if (open) {
      setQuestions(initializeQuestions());
    }
  }, [open, questionType, count]);

  // Toggle accordion expansion
  const toggleExpanded = (index) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, expanded: !q.expanded } : q))
    );
  };

  // Update question data
  const updateQuestion = (index, updatedData) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...updatedData, id: q.id, expanded: q.expanded } : q))
    );
  };

  // Validate single question
  const validateQuestion = (question) => {
    // Check required fields
    if (!question.question_text.trim()) return false;

    const points = parseInt(question.points);
    if (isNaN(points) || points < QUIZ_VALIDATION.MIN_POINTS || points > QUIZ_VALIDATION.MAX_POINTS) {
      return false;
    }

    // Check answers for non-short-answer questions
    if (questionType !== 'short_answer') {
      // Check if all answers have text
      const allAnswersHaveText = question.answers.every((a) => a.answer_text.trim());
      if (!allAnswersHaveText) return false;

      // Check if at least one answer is correct
      const hasCorrectAnswer = question.answers.some((a) => a.is_correct);
      if (!hasCorrectAnswer) return false;

      // Check minimum answers
      if (question.answers.length < MIN_ANSWERS_REQUIRED[questionType]) {
        return false;
      }
    }

    return true;
  };

  // Check if question is complete
  const isQuestionComplete = (question) => {
    return validateQuestion(question);
  };

  // Calculate valid questions count
  const validCount = questions.filter(isQuestionComplete).length;
  const completionPercentage = (validCount / count) * 100;

  // Handle submit all
  const handleSubmitAll = () => {
    // Filter only valid questions
    const validQuestions = questions.filter(isQuestionComplete);

    if (validQuestions.length === 0) {
      return;
    }

    // Prepare questions data
    const questionsData = validQuestions.map((q) => ({
      question_text: q.question_text.trim(),
      question_type: questionType,
      points: parseInt(q.points),
      explanation: q.explanation.trim() || null,
      image_file: q.image_file instanceof File ? q.image_file : null,
      answers:
        questionType !== 'short_answer'
          ? q.answers.map((a, index) => ({
              answer_text: a.answer_text.trim(),
              is_correct: a.is_correct,
              order_index: index,
            }))
          : [],
    }));

    onSubmit(questionsData);
  };

  // Handle close
  const handleClose = () => {
    onClose();
  };

  // Get question preview text
  const getQuestionPreview = (question) => {
    if (question.question_text.trim()) {
      return question.question_text.substring(0, 60) + (question.question_text.length > 60 ? '...' : '');
    }
    return 'No question text yet';
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#2D3436',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
            Bulk Add {QUESTION_TYPE_LABELS[questionType]} Questions
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {validCount} of {count} complete
            </Typography>
            <Box sx={{ width: 100 }}>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#E8E8E8',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: validCount === count ? '#43e97b' : '#667eea',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            disabled={isLoading}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          p: 3,
          backgroundColor: '#F8F9FA',
          minHeight: 'calc(100vh - 64px - 72px)', // viewport - appbar - footer
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          {questions.map((question, index) => {
            const isComplete = isQuestionComplete(question);

            return (
              <Accordion
                key={question.id}
                expanded={question.expanded}
                onChange={() => toggleExpanded(index)}
                sx={{
                  mb: 2,
                  borderRadius: '12px !important',
                  border: '1px solid #E8E8E8',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: '0 0 16px 0',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    backgroundColor: isComplete ? '#F0FFF4' : '#FFFFFF',
                    borderRadius: '12px',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      flex: 1,
                      pr: 2,
                    }}
                  >
                    {isComplete ? (
                      <CheckCircleIcon sx={{ color: '#43e97b', fontSize: 24 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ color: '#B2BEC3', fontSize: 24 }} />
                    )}

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Question {index + 1}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          fontStyle: question.question_text.trim() ? 'normal' : 'italic',
                        }}
                      >
                        {getQuestionPreview(question)}
                      </Typography>
                    </Box>

                    <Chip
                      label={isComplete ? 'Complete' : 'Incomplete'}
                      size="small"
                      sx={{
                        backgroundColor: isComplete ? '#43e97b' : '#E8E8E8',
                        color: isComplete ? '#FFFFFF' : '#636E72',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 3, py: 3, backgroundColor: '#FAFBFC' }}>
                  <QuestionFormFields
                    data={question}
                    questionType={questionType}
                    onChange={(updatedData) => updateQuestion(index, updatedData)}
                    errors={{}}
                  />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          p: 2,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E8E8E8',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Box
          sx={{
            maxWidth: 1000,
            mx: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {validCount > 0 ? (
              <>
                Ready to submit <strong>{validCount}</strong> question{validCount !== 1 ? 's' : ''}
              </>
            ) : (
              'Fill out at least one question to submit'
            )}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <QuizCraftButton
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
              sx={{
                borderColor: '#DFE6E9',
                color: '#636E72',
                '&:hover': {
                  borderColor: '#B2BEC3',
                },
              }}
            >
              Cancel
            </QuizCraftButton>
            <QuizCraftButton
              variant="contained"
              onClick={handleSubmitAll}
              loading={isLoading}
              disabled={validCount === 0}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
                },
              }}
            >
              Submit {validCount > 0 ? `${validCount} Question${validCount !== 1 ? 's' : ''}` : 'Questions'}
            </QuizCraftButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

QuestionFormBulk.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  questionType: PropTypes.oneOf(['multiple_choice', 'true_false', 'short_answer']).isRequired,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
};

QuestionFormBulk.defaultProps = {
  count: 10,
  isLoading: false,
};

export default QuestionFormBulk;
