// QuestionCard Component
// Card component for displaying question with answers
// Following Phoenix pattern with PropTypes validation

import {
  Card,
  CardContent,
  Typography,
  Box,
  Radio,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/ColorConstants';
import { QUESTION_TYPE_LABELS } from '../../constants/QuizConstants';

function QuestionCard({ question, editable = false, onEdit, onDelete }) {
  // Get question type label
  const getQuestionTypeLabel = (type) => {
    return QUESTION_TYPE_LABELS[type] || type;
  };

  // Get question type color
  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'multiple_choice':
        return COLORS.PRIMARY;
      case 'true_false':
        return COLORS.INFO;
      case 'short_answer':
        return COLORS.SECONDARY;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  // Render answers based on question type
  const renderAnswers = () => {
    if (!question.answers || question.answers.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No answers available for this question.
        </Alert>
      );
    }

    // For true/false or single correct answer
    const isSingleChoice = question.question_type === 'true_false' ||
      question.answers.filter(a => a.is_correct).length === 1;

    if (isSingleChoice) {
      return (
        <RadioGroup sx={{ mt: 2 }}>
          {question.answers.map((answer, index) => (
            <FormControlLabel
              key={answer.id || index}
              value={answer.id || index}
              control={
                <Radio
                  checked={answer.is_correct}
                  sx={{
                    color: COLORS.TEXT_SECONDARY,
                    '&.Mui-checked': {
                      color: COLORS.SUCCESS,
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{answer.answer_text}</Typography>
                  {answer.is_correct && (
                    <Chip
                      label="Correct"
                      size="small"
                      sx={{
                        bgcolor: COLORS.SUCCESS,
                        color: COLORS.WHITE,
                        fontSize: '0.7rem',
                        height: 20,
                      }}
                    />
                  )}
                </Box>
              }
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                bgcolor: answer.is_correct
                  ? 'rgba(0, 184, 148, 0.05)'
                  : COLORS.LIGHTER_GRAY,
                border: `1px solid ${
                  answer.is_correct ? COLORS.SUCCESS : COLORS.BORDER_LIGHT
                }`,
                mr: 0,
                ml: 0,
                '&:hover': {
                  bgcolor: answer.is_correct
                    ? 'rgba(0, 184, 148, 0.1)'
                    : COLORS.LIGHT_GRAY,
                },
              }}
            />
          ))}
        </RadioGroup>
      );
    }

    // For multiple correct answers
    return (
      <Box sx={{ mt: 2 }}>
        {question.answers.map((answer, index) => (
          <FormControlLabel
            key={answer.id || index}
            control={
              <Checkbox
                checked={answer.is_correct}
                sx={{
                  color: COLORS.TEXT_SECONDARY,
                  '&.Mui-checked': {
                    color: COLORS.SUCCESS,
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{answer.answer_text}</Typography>
                {answer.is_correct && (
                  <Chip
                    label="Correct"
                    size="small"
                    sx={{
                      bgcolor: COLORS.SUCCESS,
                      color: COLORS.WHITE,
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                )}
              </Box>
            }
            sx={{
              mb: 1,
              p: 1.5,
              borderRadius: 1,
              bgcolor: answer.is_correct
                ? 'rgba(0, 184, 148, 0.05)'
                : COLORS.LIGHTER_GRAY,
              border: `1px solid ${
                answer.is_correct ? COLORS.SUCCESS : COLORS.BORDER_LIGHT
              }`,
              mr: 0,
              ml: 0,
              display: 'flex',
              '&:hover': {
                bgcolor: answer.is_correct
                  ? 'rgba(0, 184, 148, 0.1)'
                  : COLORS.LIGHT_GRAY,
              },
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: editable ? '0 8px 24px rgba(108, 92, 231, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Question Type and Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}>
            <Chip
              label={getQuestionTypeLabel(question.question_type)}
              size="small"
              sx={{
                bgcolor: getQuestionTypeColor(question.question_type),
                color: COLORS.WHITE,
                fontWeight: 500,
              }}
            />
            <Chip
              label={`${question.points || 1} point${question.points !== 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
              }}
            />
          </Box>

          {/* Edit and Delete Buttons (only shown in editable mode) */}
          {editable && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {onEdit && (
                <Tooltip title="Edit Question">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(question)}
                    sx={{
                      color: COLORS.INFO,
                      '&:hover': {
                        bgcolor: 'rgba(116, 185, 255, 0.1)',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Delete Question">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(question)}
                    sx={{
                      color: COLORS.ERROR,
                      '&:hover': {
                        bgcolor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        {/* Question Text */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: COLORS.TEXT_PRIMARY,
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          {question.question_text}
        </Typography>

        {/* Question Image (if present) */}
        {question.meta?.image_url && (
          <Box
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${COLORS.BORDER_LIGHT}`,
              backgroundColor: '#F8F9FA',
            }}
          >
            <img
              src={
                question.meta.image_url.startsWith('http')
                  ? question.meta.image_url
                  : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'}${question.meta.image_url}`
              }
              alt="Question"
              style={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'contain',
                display: 'block',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Answers */}
        <Typography
          variant="subtitle2"
          sx={{
            color: COLORS.TEXT_SECONDARY,
            fontWeight: 600,
            mb: 1,
          }}
        >
          Answer Options:
        </Typography>
        {renderAnswers()}

        {/* Explanation (if provided) */}
        {question.explanation && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 1,
              bgcolor: 'rgba(108, 92, 231, 0.05)',
              border: `1px solid ${COLORS.PRIMARY_LIGHT}`,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: COLORS.PRIMARY,
                fontWeight: 600,
                mb: 1,
              }}
            >
              Explanation:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: COLORS.TEXT_SECONDARY,
                lineHeight: 1.6,
              }}
            >
              {question.explanation}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number,
    question_text: PropTypes.string.isRequired,
    question_type: PropTypes.oneOf(['multiple_choice', 'true_false', 'short_answer']).isRequired,
    points: PropTypes.number,
    explanation: PropTypes.string,
    meta: PropTypes.shape({
      image_url: PropTypes.string,
      image_file_id: PropTypes.string,
    }),
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        answer_text: PropTypes.string.isRequired,
        is_correct: PropTypes.bool.isRequired,
      })
    ),
  }).isRequired,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default QuestionCard;
