// QuizCard Component
// Card component for displaying quiz in list
// Following Phoenix pattern with PropTypes validation

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/ColorConstants';
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../../constants/QuizConstants';
import QuizCraftButton from '../buttons/QuizCraftButton';

function QuizCard({ quiz, onView, onEdit, onDelete }) {
  // Helper function to get status badge color
  const getStatusColor = (isPublished) => {
    return isPublished ? COLORS.PUBLISHED : COLORS.DRAFT;
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid #E8E8E8',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.15)',
          transform: 'translateY(-4px)',
          borderColor: '#667eea',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header with Title and Status Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              color: COLORS.TEXT_PRIMARY,
              flex: 1,
              mr: 2,
            }}
          >
            {quiz.title}
          </Typography>
          <Chip
            label={quiz.is_published ? 'Published' : 'Draft'}
            size="small"
            sx={{
              bgcolor: getStatusColor(quiz.is_published),
              color: COLORS.WHITE,
              fontWeight: 500,
            }}
          />
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3em',
          }}
        >
          {quiz.description || 'No description provided'}
        </Typography>

        {/* Category and Difficulty */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={quiz.category}
            size="small"
            variant="outlined"
            sx={{
              borderColor: COLORS.PRIMARY,
              color: COLORS.PRIMARY,
            }}
          />
          <Chip
            label={DIFFICULTY_LABELS[quiz.difficulty] || quiz.difficulty}
            size="small"
            color={DIFFICULTY_COLORS[quiz.difficulty] || 'default'}
          />
        </Box>

        {/* Tags */}
        {quiz.tags && quiz.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            {quiz.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: COLORS.LIGHTER_GRAY,
                  color: COLORS.TEXT_SECONDARY,
                  fontSize: '0.75rem',
                }}
              />
            ))}
            {quiz.tags.length > 3 && (
              <Chip
                label={`+${quiz.tags.length - 3}`}
                size="small"
                sx={{
                  bgcolor: COLORS.LIGHTER_GRAY,
                  color: COLORS.TEXT_SECONDARY,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>
        )}

        {/* Stats */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            pt: 2,
            borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
          }}
        >
          <Tooltip title="Questions">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <QuestionAnswerIcon sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Typography variant="body2" color="text.secondary">
                {quiz.question_count || 0}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Views">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Typography variant="body2" color="text.secondary">
                {quiz.view_count || 0}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Shares">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ShareIcon sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Typography variant="body2" color="text.secondary">
                {quiz.share_count || 0}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        {/* Latest Attempt Info */}
        {quiz.latest_attempt && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: quiz.latest_attempt.passed
                ? 'rgba(67, 233, 123, 0.1)'
                : 'rgba(245, 87, 108, 0.1)',
              border: '1px solid',
              borderColor: quiz.latest_attempt.passed
                ? 'rgba(67, 233, 123, 0.3)'
                : 'rgba(245, 87, 108, 0.3)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>
                Latest Attempt
              </Typography>
              <Chip
                label={quiz.latest_attempt.passed ? 'Passed' : 'Failed'}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  backgroundColor: quiz.latest_attempt.passed ? '#43e97b' : '#f5576c',
                  color: COLORS.WHITE,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                Score: {quiz.latest_attempt.percentage?.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {quiz.latest_attempt.score}/{quiz.latest_attempt.max_score} pts
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Quiz">
            <IconButton
              size="small"
              onClick={() => onView(quiz)}
              sx={{
                color: COLORS.PRIMARY,
                '&:hover': {
                  bgcolor: 'rgba(108, 92, 231, 0.1)',
                },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Quiz">
            <IconButton
              size="small"
              onClick={() => onEdit(quiz)}
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
          <Tooltip title="Delete Quiz">
            <IconButton
              size="small"
              onClick={() => onDelete(quiz)}
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
        </Stack>

        <QuizCraftButton
          variant="contained"
          size="small"
          onClick={() => onView(quiz)}
          sx={{
            background: `linear-gradient(135deg, ${COLORS.PRIMARY} 0%, ${COLORS.PRIMARY_LIGHT} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_DARK} 0%, ${COLORS.PRIMARY} 100%)`,
            },
          }}
        >
          View Details
        </QuizCraftButton>
      </CardActions>
    </Card>
  );
}

QuizCard.propTypes = {
  quiz: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']).isRequired,
    question_count: PropTypes.number,
    view_count: PropTypes.number,
    share_count: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    is_published: PropTypes.bool,
    latest_attempt: PropTypes.shape({
      attempt_id: PropTypes.string,
      status: PropTypes.string,
      score: PropTypes.number,
      max_score: PropTypes.number,
      percentage: PropTypes.number,
      passed: PropTypes.bool,
      started_at: PropTypes.string,
      submitted_at: PropTypes.string,
    }),
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default QuizCard;
