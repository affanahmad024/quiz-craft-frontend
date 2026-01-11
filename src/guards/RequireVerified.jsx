// Require Verified Guard
// Requires email to be verified

import { Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import LoadingScreen from '../components/screens/LoadingScreen';
import { ROUTES } from '../constants/RouteConstants';

/**
 * Route guard that requires email verification
 * Shows verification required screen if not verified
 */
function RequireVerified({ children }) {
  const { isAuthenticated, isLoading, isEmailVerified, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking verification status..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isEmailVerified()) {
    return <VerificationRequiredScreen email={user?.email} />;
  }

  return children;
}

function VerificationRequiredScreen({ email }) {
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
      <EmailIcon sx={{ fontSize: 80, color: 'warning.main', mb: 3 }} />

      <Typography variant="h4" gutterBottom>
        Email Verification Required
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        Please verify your email address to access this feature. We&apos;ve sent a
        verification link to <strong>{email}</strong>
      </Typography>

      <Button variant="contained" href={ROUTES.VERIFY_EMAIL}>
        Verify Email
      </Button>
    </Box>
  );
}

VerificationRequiredScreen.propTypes = {
  email: PropTypes.string,
};

RequireVerified.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireVerified;
