// Page Transition Wrapper Component
// Wraps page content with smooth Framer Motion transitions
// QuizCraft themed animations

import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { pageTransition, pageSlideTransition, pageFadeTransition } from '../../styles/animations';

/**
 * PageTransition - Wrapper component for page-level animations
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Page content to animate
 * @param {string} props.variant - Animation variant: 'default' | 'slide' | 'fade'
 * @param {string} props.className - Additional CSS classes
 */
function PageTransition({
  children,
  variant = 'default',
  className = '',
}) {

  // Select animation variant
  const getVariant = () => {
    switch (variant) {
      case 'slide':
        return pageSlideTransition;
      case 'fade':
        return pageFadeTransition;
      default:
        return pageTransition;
    }
  };

  const animation = getVariant();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animation}
      className={className}
      style={{
        width: '100%',
        minHeight: '100%',
      }}
    >
      {children}
    </motion.div>
  );
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'slide', 'fade']),
  className: PropTypes.string,
};

export default PageTransition;
