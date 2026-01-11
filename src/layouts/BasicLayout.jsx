// Basic Layout
// Layout for authenticated pages
// Following Phoenix pattern

import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Basic layout wrapper for authenticated pages
 * Will be enhanced with navigation/sidebar in later phases
 */
function BasicLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header/Navigation will be added in Phase 3 */}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>

      {/* Footer can be added later */}
    </Box>
  );
}

export default BasicLayout;
