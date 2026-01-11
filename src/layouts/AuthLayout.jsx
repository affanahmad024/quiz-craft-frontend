// Auth Layout
// Simple layout for authentication pages
// Following Phoenix pattern

import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

/**
 * Layout wrapper for authentication screens
 * Provides consistent structure for login, signup, etc.
 */
function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Outlet />
    </Box>
  );
}

export default AuthLayout;
