// Set Browser Tab Title Component
// Dynamically updates the browser tab title based on current page
// Following Phoenix pattern

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * SetBrowserTabTitle
 * Component that updates the browser tab title based on the current route
 *
 * @param {Object} props
 * @param {string} props.title - Page-specific title
 * @param {string} props.suffix - Optional suffix (default: "QuizCraft")
 */
function SetBrowserTabTitle({ title, suffix = 'QuizCraft' }) {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = suffix ? `${title} | ${suffix}` : title;
    } else {
      document.title = suffix;
    }

    // Cleanup - reset to default when component unmounts
    return () => {
      document.title = 'QuizCraft';
    };
  }, [title, suffix, location.pathname]);

  // This component doesn't render anything
  return null;
}

SetBrowserTabTitle.propTypes = {
  title: PropTypes.string,
  suffix: PropTypes.string,
};

export default SetBrowserTabTitle;
