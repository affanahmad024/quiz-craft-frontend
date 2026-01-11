// Skip to Content Component
// Accessibility helper for keyboard navigation
// Following Phoenix pattern

import { Button } from '@mui/material';

/**
 * Skip to Content Component
 * Provides keyboard users a way to skip navigation and go directly to main content
 */
function SkipToContent() {
  const handleSkip = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <Button
      onClick={handleSkip}
      sx={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        padding: '8px 16px',
        backgroundColor: 'primary.main',
        color: 'white',
        '&:focus': {
          left: '10px',
          top: '10px',
        },
      }}
    >
      Skip to main content
    </Button>
  );
}

export default SkipToContent;
