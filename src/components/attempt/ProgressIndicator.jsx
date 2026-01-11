// Progress Indicator Component
// Shows quiz progress and statistics
// Following Phoenix pattern

import PropTypes from 'prop-types';
import { Box, Typography, LinearProgress, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { COLORS } from '../../constants/ColorConstants';

/**
 * Progress Indicator Component
 * Shows current progress through quiz
 */
function ProgressIndicator({ currentQuestion, totalQuestions, answeredCount }) {
  const progress = (answeredCount / totalQuestions) * 100;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          textAlign: 'center',
        }}
      >
        Question {currentQuestion} of {totalQuestions}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          mb: 2,
          bgcolor: 'rgba(108, 92, 231, 0.1)',
          '& .MuiLinearProgress-bar': {
            background: `linear-gradient(90deg, ${COLORS.PRIMARY} 0%, ${COLORS.PRIMARY_LIGHT} 100%)`,
            borderRadius: 5,
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {progress.toFixed(0)}% Complete
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ color: COLORS.SUCCESS, fontSize: '1.2rem' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Answered: {answeredCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RadioButtonUncheckedIcon sx={{ color: COLORS.SECONDARY_TEXT, fontSize: '1.2rem' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Remaining: {unansweredCount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

ProgressIndicator.propTypes = {
  currentQuestion: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  answeredCount: PropTypes.number.isRequired,
};

export default ProgressIndicator;
