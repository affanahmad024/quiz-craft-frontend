// Quiz Timer Component
// Countdown timer for quiz attempts
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Card } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { COLORS } from '../../constants/ColorConstants';

/**
 * Quiz Timer Component
 * Shows countdown timer with color coding
 */
function QuizTimer({ expiresAt, onExpire }) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expires = new Date(expiresAt).getTime();
      const remaining = Math.max(0, expires - now);
      return Math.floor(remaining / 1000); // Convert to seconds
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Determine color based on time remaining
  let color = COLORS.SUCCESS;
  let bgcolor = 'rgba(0, 184, 148, 0.1)';

  if (timeRemaining < 60) {
    // Less than 1 minute: red
    color = COLORS.ERROR;
    bgcolor = 'rgba(255, 107, 107, 0.1)';
  } else if (timeRemaining < 300) {
    // Less than 5 minutes: orange
    color = COLORS.WARNING;
    bgcolor = 'rgba(253, 203, 110, 0.1)';
  }

  return (
    <Card
      sx={{
        p: 2,
        bgcolor,
        border: `2px solid ${color}`,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <AccessTimeIcon sx={{ color, fontSize: '2rem' }} />
        <Typography
          variant="h4"
          sx={{
            color,
            fontWeight: 700,
            fontFamily: 'monospace',
          }}
        >
          {formattedTime}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: 'text.secondary',
          mt: 0.5,
        }}
      >
        Time Remaining
      </Typography>
    </Card>
  );
}

QuizTimer.propTypes = {
  expiresAt: PropTypes.string.isRequired,
  onExpire: PropTypes.func,
};

export default QuizTimer;
