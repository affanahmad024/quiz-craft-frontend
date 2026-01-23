// Question Form Fields Component
// Reusable form fields for question entry
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  IconButton,
  Typography,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import QuizCraftTextInput from '../inputs/QuizCraftTextInput';
import ImageUploadField from '../inputs/ImageUploadField';
import {
  QUIZ_VALIDATION,
  MIN_ANSWERS_REQUIRED,
  MAX_ANSWERS_ALLOWED,
} from '../../constants/QuizConstants';

/**
 * QuestionFormFields Component
 * Reusable form fields for question entry
 * @param {object} data - Question data
 * @param {string} questionType - Type of question (pre-selected)
 * @param {function} onChange - Callback when data changes
 * @param {object} errors - Validation errors
 */
function QuestionFormFields({ data, questionType, onChange, errors }) {
  // Handle field change
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    onChange({ ...data, [field]: value });
  };

  // Handle image upload
  const handleImageChange = (fileId) => {
    onChange({ ...data, image_file_id: fileId });
  };

  // Handle answer change
  const handleAnswerChange = (index, field, value) => {
    const newAnswers = [...data.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    onChange({ ...data, answers: newAnswers });
  };

  // Add answer (for multiple choice)
  const handleAddAnswer = () => {
    if (data.answers.length >= MAX_ANSWERS_ALLOWED[questionType]) {
      return;
    }

    const newAnswer = {
      answer_text: '',
      is_correct: false,
      order_index: data.answers.length,
    };

    onChange({ ...data, answers: [...data.answers, newAnswer] });
  };

  // Remove answer (for multiple choice)
  const handleRemoveAnswer = (index) => {
    if (data.answers.length <= MIN_ANSWERS_REQUIRED[questionType]) {
      return;
    }

    const newAnswers = data.answers.filter((_, i) => i !== index);
    // Update order indices
    newAnswers.forEach((answer, i) => {
      answer.order_index = i;
    });

    onChange({ ...data, answers: newAnswers });
  };

  // Handle correct answer selection (for multiple choice - checkbox)
  const handleCorrectAnswerToggle = (index) => {
    const newAnswers = [...data.answers];
    newAnswers[index].is_correct = !newAnswers[index].is_correct;
    onChange({ ...data, answers: newAnswers });
  };

  // Handle correct answer selection (for true/false - radio)
  const handleTrueFalseCorrect = (index) => {
    const newAnswers = data.answers.map((answer, i) => ({
      ...answer,
      is_correct: i === index,
    }));
    onChange({ ...data, answers: newAnswers });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Question Text */}
      <QuizCraftTextInput
        label="Question Text *"
        placeholder="Enter your question here..."
        value={data.question_text}
        onChange={handleChange('question_text')}
        error={!!errors?.question_text}
        helperText={
          errors?.question_text ||
          `${data.question_text.length}/${QUIZ_VALIDATION.QUESTION_TEXT_MAX_LENGTH} characters`
        }
        multiline
        rows={3}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F8F9FA',
          },
        }}
      />

      {/* Points */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <QuizCraftTextInput
            label="Points *"
            type="number"
            placeholder="e.g., 10"
            value={data.points}
            onChange={handleChange('points')}
            error={!!errors?.points}
            helperText={errors?.points || 'Points awarded for correct answer'}
            fullWidth
            inputProps={{
              min: QUIZ_VALIDATION.MIN_POINTS,
              max: QUIZ_VALIDATION.MAX_POINTS,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F8F9FA',
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Explanation (Optional) */}
      <QuizCraftTextInput
        label="Explanation (Optional)"
        placeholder="Explain the correct answer..."
        value={data.explanation}
        onChange={handleChange('explanation')}
        error={!!errors?.explanation}
        helperText={
          errors?.explanation ||
          `${data.explanation.length}/${QUIZ_VALIDATION.EXPLANATION_MAX_LENGTH} characters`
        }
        multiline
        rows={2}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F8F9FA',
          },
        }}
      />

      {/* Image Upload */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: '#2D3436',
          }}
        >
          Question Image (Optional)
        </Typography>
        <ImageUploadField
          value={data.image_file_id}
          onChange={handleImageChange}
          error={errors?.image_file_id}
        />
      </Box>

      {/* Answers Section (based on question type) */}
      {questionType !== 'short_answer' && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: '#2D3436',
              }}
            >
              Answers *
            </Typography>

            {questionType === 'multiple_choice' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {data.answers.length}/{MAX_ANSWERS_ALLOWED[questionType]} answers
                </Typography>
                {data.answers.length < MAX_ANSWERS_ALLOWED[questionType] && (
                  <IconButton
                    size="small"
                    onClick={handleAddAnswer}
                    sx={{
                      backgroundColor: '#667eea',
                      color: '#FFFFFF',
                      width: 28,
                      height: 28,
                      '&:hover': {
                        backgroundColor: '#5568d3',
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>
            )}
          </Box>

          {/* True/False Answers */}
          {questionType === 'true_false' && (
            <RadioGroup
              value={data.answers.findIndex((a) => a.is_correct).toString()}
              onChange={(e) => handleTrueFalseCorrect(parseInt(e.target.value))}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {data.answers.map((answer, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '2px solid',
                      borderColor: answer.is_correct ? '#667eea' : '#E8E8E8',
                      borderRadius: 2,
                      backgroundColor: answer.is_correct
                        ? alpha('#667eea', 0.05)
                        : '#F8F9FA',
                      transition: 'all 0.2s',
                    }}
                  >
                    <FormControlLabel
                      value={index.toString()}
                      control={<Radio sx={{ color: '#667eea', '&.Mui-checked': { color: '#667eea' } }} />}
                      label={
                        <Typography sx={{ fontWeight: answer.is_correct ? 600 : 400 }}>
                          {answer.answer_text}
                        </Typography>
                      }
                    />
                  </Box>
                ))}
              </Box>
            </RadioGroup>
          )}

          {/* Multiple Choice Answers */}
          {questionType === 'multiple_choice' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.answers.map((answer, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.5,
                    border: '2px solid',
                    borderColor: errors?.answers?.[index] ? '#f5576c' : '#E8E8E8',
                    borderRadius: 2,
                    backgroundColor: '#F8F9FA',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={answer.is_correct}
                          onChange={() => handleCorrectAnswerToggle(index)}
                          sx={{
                            color: '#667eea',
                            '&.Mui-checked': {
                              color: '#667eea',
                            },
                          }}
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />

                    <QuizCraftTextInput
                      placeholder={`Answer option ${index + 1}...`}
                      value={answer.answer_text}
                      onChange={(e) =>
                        handleAnswerChange(index, 'answer_text', e.target.value)
                      }
                      error={!!errors?.answers?.[index]}
                      helperText={errors?.answers?.[index]}
                      fullWidth
                      size="small"
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                        },
                      }}
                    />

                    {data.answers.length > MIN_ANSWERS_REQUIRED[questionType] && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveAnswer(index)}
                        sx={{
                          color: '#f5576c',
                          '&:hover': {
                            backgroundColor: alpha('#f5576c', 0.1),
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {errors?.answers && typeof errors.answers === 'string' && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 0.75,
                color: '#f5576c',
                fontSize: '0.75rem',
              }}
            >
              {errors.answers}
            </Typography>
          )}
        </Box>
      )}

      {/* Short Answer Note */}
      {questionType === 'short_answer' && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha('#667eea', 0.05),
            border: '1px solid',
            borderColor: alpha('#667eea', 0.2),
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Short answer questions don't require predefined answers. Participants
            will type their response, and you can grade them manually.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

QuestionFormFields.propTypes = {
  data: PropTypes.shape({
    question_text: PropTypes.string.isRequired,
    points: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    explanation: PropTypes.string,
    image_file_id: PropTypes.string,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        answer_text: PropTypes.string.isRequired,
        is_correct: PropTypes.bool.isRequired,
        order_index: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  questionType: PropTypes.oneOf(['multiple_choice', 'true_false', 'short_answer']).isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

QuestionFormFields.defaultProps = {
  errors: {},
};

export default QuestionFormFields;
