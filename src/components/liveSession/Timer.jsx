// Timer Component
// Countdown timer for live session questions
// Following Phoenix pattern

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { formatTime, TIMER_CONFIG } from '../../constants/LiveSessionConstants';

/**
 * Timer Component
 * Displays countdown timer with warning animation
 */
function Timer({ seconds, maxSeconds = TIMER_CONFIG.DEFAULT_SECONDS, size = 'medium' }) {
  const isWarning = seconds <= TIMER_CONFIG.WARNING_SECONDS;
  const percentage = (seconds / maxSeconds) * 100;

  const sizeStyles = {
    small: {
      width: 60,
      height: 60,
      fontSize: '1.25rem',
    },
    medium: {
      width: 80,
      height: 80,
      fontSize: '1.75rem',
    },
    large: {
      width: 120,
      height: 120,
      fontSize: '2.5rem',
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <motion.div
      animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
    >
      <Box
        sx={{
          position: 'relative',
          width: currentSize.width,
          height: currentSize.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Circular Progress Background */}
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'rotate(-90deg)',
          }}
        >
          {/* Background Circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="4"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke={isWarning ? '#ef4444' : '#0D5C3F'}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * (currentSize.width * 0.45)}`}
            strokeDashoffset={`${2 * Math.PI * (currentSize.width * 0.45) * (1 - percentage / 100)}`}
            strokeLinecap="round"
            initial={false}
            animate={{ strokeDashoffset: `${2 * Math.PI * (currentSize.width * 0.45) * (1 - percentage / 100)}` }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Timer Text */}
        <Typography
          variant="h4"
          sx={{
            fontSize: currentSize.fontSize,
            fontWeight: 700,
            color: isWarning ? '#ef4444' : '#2D3436',
            fontFamily: 'monospace',
          }}
        >
          {seconds}
        </Typography>
      </Box>
    </motion.div>
  );
}

Timer.propTypes = {
  seconds: PropTypes.number.isRequired,
  maxSeconds: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Timer;
