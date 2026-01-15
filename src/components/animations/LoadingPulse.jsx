// Loading Pulse Component
// Pulsing circle animation with QuizCraft green gradient

import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { loadingPulse } from '../../styles/animations';

/**
 * LoadingPulse - Animated pulsing circle loader
 *
 * @param {Object} props
 * @param {number} props.size - Pulse size in pixels
 */
function LoadingPulse({
  size = 80,
}) {

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      {/* Outer pulsing circle */}
      <motion.div
        variants={loadingPulse}
        animate="animate"
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)', // Logo gradient
        }}
      />

      {/* Inner static circle */}
      <Box
        sx={{
          position: 'absolute',
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
        }}
      />
    </Box>
  );
}

LoadingPulse.propTypes = {
  size: PropTypes.number,
};

export default LoadingPulse;
