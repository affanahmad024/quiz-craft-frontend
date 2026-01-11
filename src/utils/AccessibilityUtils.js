// Accessibility Utilities
// Helper functions for accessibility features
// Following Phoenix pattern

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Announcement priority ('polite' or 'assertive')
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.classList.add('sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Trap focus within a container (for modals, dialogs)
 * @param {HTMLElement} container - Container element
 * @returns {Function} Cleanup function
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  // Focus first element
  if (firstElement) {
    firstElement.focus();
  }

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get ARIA label for quiz difficulty
 * @param {string} difficulty
 * @returns {string}
 */
export function getDifficultyAriaLabel(difficulty) {
  const labels = {
    easy: 'Easy difficulty',
    medium: 'Medium difficulty',
    hard: 'Hard difficulty',
  };
  return labels[difficulty?.toLowerCase()] || 'Unknown difficulty';
}

/**
 * Get ARIA label for score percentage
 * @param {number} score
 * @param {number} total
 * @returns {string}
 */
export function getScoreAriaLabel(score, total) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  return `Score: ${score} out of ${total}, which is ${percentage} percent`;
}

/**
 * Add screen reader only CSS class
 */
export function addScreenReaderStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  document.head.appendChild(style);
}
