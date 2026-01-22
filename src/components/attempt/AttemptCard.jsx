// Attempt Card Component
// Card for displaying quiz attempt in list
// Following Phoenix pattern

import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassIcon,
  PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from '../../funcs/DateTimeFuncs';
import QuizCraftButton from '../buttons/QuizCraftButton';

/**
 * Attempt Card Component
 * Displays a quiz attempt with status and score
 */
function AttemptCard({ attempt, onViewResults, onContinue }) {
  // Status badge configuration
  const statusConfig = {
    in_progress: {
      label: 'In Progress',
      color: '#fdcb6e',
      bgColor: '#FFF9E6',
      icon: HourglassIcon,
    },
    submitted: {
      label: 'Completed',
      color: attempt.passed ? '#43e97b' : '#f5576c',
      bgColor: attempt.passed ? '#E8FFF3' : '#FFE8EC',
      icon: attempt.passed ? CheckCircleIcon : CancelIcon,
    },
    expired: {
      label: 'Expired',
      color: '#636E72',
      bgColor: '#F5F6F7',
      icon: CancelIcon,
    },
  };

  const config = statusConfig[attempt.status];
  const StatusIcon = config.icon;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid #E8E8E8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        {/* Status Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: config.bgColor,
            mb: 2,
          }}
        >
          <StatusIcon sx={{ fontSize: 16, color: config.color }} />
          <Typography
            variant="caption"
            sx={{
              color: config.color,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            {config.label}
          </Typography>
        </Box>

        {/* Quiz Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#2D3436',
            mb: 2,
            lineHeight: 1.3,
          }}
        >
          {attempt.quiz_title}
        </Typography>

        {/* Score Section - Submitted */}
        {attempt.status === 'submitted' && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 1,
                mb: 1,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: attempt.passed
                    ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                    : 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {attempt.percentage?.toFixed(0)}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#636E72' }}>
                ({attempt.score} / {attempt.max_score || 100})
              </Typography>
            </Box>

            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={attempt.percentage || 0}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#E8E8E8',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: attempt.passed
                    ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                    : 'linear-gradient(90deg, #f5576c 0%, #f093fb 100%)',
                },
              }}
            />
          </Box>
        )}

        {/* Timestamps */}
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <ScheduleIcon sx={{ fontSize: 16, color: '#636E72' }} />
            <Typography variant="caption" sx={{ color: '#636E72' }}>
              Started {formatDistanceToNow(attempt.started_at)} ago
            </Typography>
          </Box>
          {attempt.submitted_at && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: '#636E72' }} />
              <Typography variant="caption" sx={{ color: '#636E72' }}>
                Submitted {formatDistanceToNow(attempt.submitted_at)} ago
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        {attempt.status === 'submitted' ? (
          <QuizCraftButton
            variant="contained"
            fullWidth
            startIcon={<VisibilityIcon />}
            onClick={() => onViewResults(attempt)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              py: 1.2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
              },
            }}
          >
            View Results
          </QuizCraftButton>
        ) : attempt.status === 'in_progress' ? (
          <QuizCraftButton
            variant="contained"
            fullWidth
            startIcon={<PlayArrowIcon />}
            onClick={() => onContinue(attempt)}
            sx={{
              background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
              fontWeight: 600,
              py: 1.2,
              '&:hover': {
                background: 'linear-gradient(135deg, #f0b848 0%, #d35a42 100%)',
              },
            }}
          >
            Continue
          </QuizCraftButton>
        ) : null}
      </CardActions>
    </Card>
  );
}

AttemptCard.propTypes = {
  attempt: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quiz_id: PropTypes.string,
    quiz_title: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['in_progress', 'submitted', 'expired']).isRequired,
    score: PropTypes.number,
    percentage: PropTypes.number,
    passed: PropTypes.bool,
    max_score: PropTypes.number,
    started_at: PropTypes.string.isRequired,
    submitted_at: PropTypes.string,
  }).isRequired,
  onViewResults: PropTypes.func.isRequired,
  onContinue: PropTypes.func,
};

AttemptCard.defaultProps = {
  onContinue: () => {},
};

export default AttemptCard;
