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
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDistanceToNow } from '../../funcs/DateTimeFuncs';
import { COLORS } from '../../constants/ColorConstants';

/**
 * Attempt Card Component
 * Displays a quiz attempt with status and score
 */
function AttemptCard({ attempt, onViewResults }) {
  // Status badge colors
  const statusColors = {
    in_progress: 'info',
    submitted: 'success',
    expired: 'error',
  };

  const statusLabels = {
    in_progress: 'In Progress',
    submitted: 'Submitted',
    expired: 'Expired',
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {attempt.quiz_title}
          </Typography>
          <Chip
            label={statusLabels[attempt.status]}
            color={statusColors[attempt.status]}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {attempt.status === 'submitted' && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.PRIMARY }}>
                {attempt.score} / {attempt.max_score || 100}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({attempt.percentage?.toFixed(1)}%)
              </Typography>
            </Box>

            {attempt.passed !== null && (
              <Chip
                label={attempt.passed ? 'Passed' : 'Failed'}
                icon={attempt.passed ? <CheckCircleIcon /> : <CancelIcon />}
                color={attempt.passed ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Started: {formatDistanceToNow(attempt.started_at)} ago
          </Typography>
          {attempt.submitted_at && (
            <Typography variant="body2" color="text.secondary">
              Submitted: {formatDistanceToNow(attempt.submitted_at)} ago
            </Typography>
          )}
        </Box>
      </CardContent>

      {attempt.status === 'submitted' && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onViewResults(attempt)}
            sx={{
              background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)',
              },
            }}
          >
            View Results
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

AttemptCard.propTypes = {
  attempt: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
};

export default AttemptCard;
