// Fade In View Component
// Simple fade-in animation for any content
// QuizCraft themed

import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight } from '../../styles/animations';

/**
 * FadeInView - Wrapper that fades in its children
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Content to animate
 * @param {string} props.direction - Fade direction: 'up' | 'down' | 'left' | 'right' | 'none'
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.duration - Animation duration in seconds
 */
function FadeInView({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
}) {

  // Select animation variant based on direction
  const getVariant = () => {
    switch (direction) {
      case 'up':
        return fadeInUp;
      case 'down':
        return fadeInDown;
      case 'left':
        return fadeInLeft;
      case 'right':
        return fadeInRight;
      case 'none':
      default:
        return fadeIn;
    }
  };

  const variant = getVariant();

  // Add custom delay and duration
  const customVariant = {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        ...variant.animate.transition,
        delay,
        duration,
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={customVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
}

FadeInView.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right', 'none']),
  delay: PropTypes.number,
  duration: PropTypes.number,
  className: PropTypes.string,
};

export default FadeInView;
