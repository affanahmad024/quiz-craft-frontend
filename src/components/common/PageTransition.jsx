// Page Transition Component
// Wraps pages with smooth transitions
// Following Phoenix pattern

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Page Transition Component
 * Adds smooth fade and slide transitions between pages
 */
function PageTransition({ children, variant = 'fade' }) {
  const location = useLocation();

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  };

  const selectedVariant = variants[variant] || variants.fade;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['fade', 'slideUp', 'slideLeft', 'scale']),
};

export default PageTransition;
