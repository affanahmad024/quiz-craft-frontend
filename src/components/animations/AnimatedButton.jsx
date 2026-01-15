// Animated Button Component
// Button with hover, tap, and pulse animations
// QuizCraft themed with green gradient effects

import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { buttonHover, buttonPulse } from '../../styles/animations';

/**
 * AnimatedButton - Material-UI Button with Framer Motion animations
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Button content
 * @param {boolean} props.pulse - Enable pulsing animation
 * @param {boolean} props.animateHover - Enable hover animation
 * @param {Object} props.sx - MUI sx prop for styling
 */
function AnimatedButton({
  children,
  pulse = false,
  animateHover = true,
  sx = {},
  ...props
}) {

  const MotionButton = motion(Button);

  const variants = pulse ? buttonPulse : buttonHover;

  return (
    <MotionButton
      initial="rest"
      animate={pulse ? "animate" : "rest"}
      whileHover={animateHover && !pulse ? "hover" : undefined}
      whileTap={!pulse ? "tap" : undefined}
      variants={variants}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  pulse: PropTypes.bool,
  animateHover: PropTypes.bool,
  sx: PropTypes.object,
};

export default AnimatedButton;
