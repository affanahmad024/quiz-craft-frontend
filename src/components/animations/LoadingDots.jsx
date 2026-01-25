// Loading Dots Component
// Bouncing dots animation with QuizCraft green theme

import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * LoadingDots - Animated bouncing dots loader
 *
 * @param {Object} props
 * @param {number} props.size - Dot size in pixels
 * @param {string} props.color - Dot color (defaults to QuizCraft green)
 */
function LoadingDots({
  size = 12,
  color = '#0D5C3F', // Dark green from logo
}) {

  const bounceTransition = {
    duration: 0.6,
    repeat: Infinity,
    ease: 'easeInOut',
  };

  const dotStyle = {
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: '50%',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={dotStyle}
          animate={{
            y: [0, -size * 1.5, 0],
          }}
          transition={{
            ...bounceTransition,
            delay: index * 0.15,
          }}
        />
      ))}
    </Box>
  );
}

LoadingDots.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default LoadingDots;
