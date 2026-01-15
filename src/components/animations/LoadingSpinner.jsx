// Loading Spinner Component
// Custom spinner with QuizCraft green gradient theme
// Matches the logo colors

import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { loadingSpinner } from '../../styles/animations';

/**
 * LoadingSpinner - Animated loading spinner with QuizCraft branding
 *
 * @param {Object} props
 * @param {number} props.size - Spinner size in pixels
 * @param {string} props.message - Optional loading message
 * @param {boolean} props.fullscreen - Show as fullscreen overlay
 */
function LoadingSpinner({
  size = 60,
  message = '',
  fullscreen = false,
}) {

  const spinnerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      {/* Spinner Circle */}
      <motion.div
        variants={loadingSpinner}
        animate="animate"
        style={{
          width: size,
          height: size,
          border: `${size / 15}px solid transparent`,
          borderTopColor: '#0D5C3F', // Dark green from logo
          borderRightColor: '#0D5C3F',
          borderRadius: '50%',
        }}
      />

      {/* Optional Message */}
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullscreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        }}
      >
        {spinnerContent}
      </Box>
    );
  }

  return spinnerContent;
}

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  message: PropTypes.string,
  fullscreen: PropTypes.bool,
};

export default LoadingSpinner;
