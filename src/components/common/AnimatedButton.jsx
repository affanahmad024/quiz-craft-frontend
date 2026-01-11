// Animated Button Component
// Button with hover and tap animations
// Following Phoenix pattern

import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const MotionButton = motion(Button);

/**
 * Animated Button Component
 * Adds smooth hover and tap animations to buttons
 */
function AnimatedButton({ children, whileHover, whileTap, ...props }) {
  return (
    <MotionButton
      whileHover={{
        scale: 1.05,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        ...whileHover,
      }}
      whileTap={{
        scale: 0.95,
        ...whileTap,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
};

export default AnimatedButton;
