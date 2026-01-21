// Basic Layout
// Layout for authenticated pages with persistent navbar
// Following Phoenix pattern

import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../layout/Header';

/**
 * Basic layout wrapper for authenticated pages
 * Includes persistent header navigation
 */
function BasicLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F9FA',
      }}
    >
      {/* Persistent Header Navigation */}
      <Header />

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
    </Box>
  );
}

export default BasicLayout;
