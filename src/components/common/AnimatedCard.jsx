// Animated Card Component
// Card with hover animations
// Following Phoenix pattern

import { Card } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const MotionCard = motion(Card);

/**
 * Animated Card Component
 * Adds smooth hover animations to cards
 */
function AnimatedCard({ children, variant = 'default', ...props }) {
  const variants = {
    default: {
      whileHover: {
        y: -8,
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
      },
    },
    subtle: {
      whileHover: {
        y: -4,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
    },
    scale: {
      whileHover: {
        scale: 1.02,
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
      },
    },
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <MotionCard
      whileHover={selectedVariant.whileHover}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      {...props}
    >
      {children}
    </MotionCard>
  );
}

AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'subtle', 'scale']),
};

export default AnimatedCard;
