// Animated Card Component
// Card with hover and tap animations
// QuizCraft themed

import { motion } from 'framer-motion';
import { Card } from '@mui/material';
import PropTypes from 'prop-types';
import { cardHover, cardTap } from '../../styles/animations';

/**
 * AnimatedCard - Material-UI Card with Framer Motion animations
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Card content
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.animateHover - Enable hover animation
 * @param {boolean} props.animateTap - Enable tap animation
 * @param {Object} props.sx - MUI sx prop for styling
 */
function AnimatedCard({
  children,
  onClick,
  animateHover = true,
  animateTap = true,
  sx = {},
  ...props
}) {

  const MotionCard = motion(Card);

  return (
    <MotionCard
      initial="rest"
      whileHover={animateHover ? "hover" : undefined}
      whileTap={animateTap ? "tap" : undefined}
      variants={{
        ...(animateHover && cardHover),
        ...(animateTap && cardTap),
      }}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionCard>
  );
}

AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  animateHover: PropTypes.bool,
  animateTap: PropTypes.bool,
  sx: PropTypes.object,
};

export default AnimatedCard;
