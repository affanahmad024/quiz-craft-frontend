// Require Admin Guard
// Requires admin role

import { Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import LoadingScreen from '../components/screens/LoadingScreen';
import { ROUTES } from '../constants/RouteConstants';

/**
 * Route guard that requires admin role
 * Shows access denied if not admin
 */
function RequireAdmin({ children }) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin()) {
    return <AccessDeniedScreen />;
  }

  return children;
}

function AccessDeniedScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 3,
      }}
    >
      <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />

      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        You don&apos;t have permission to access this page.
        <br />
        Admin access is required.
      </Typography>
    </Box>
  );
}

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAdmin;
