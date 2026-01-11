// Dashboard Screen
// Temporary dashboard for Phase 2 testing
// Following Phoenix pattern

import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import { ROUTES } from '../constants/RouteConstants';

/**
 * Temporary Dashboard Screen for Phase 2 Testing
 * Will be replaced with full dashboard in later phases
 */
function DashboardScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const handleChangePassword = () => {
    navigate(ROUTES.CHANGE_PASSWORD);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Welcome to QuizCraft
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            You are successfully logged in!
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Dashboard - Phase 2 Complete! ✅
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>User Information:</strong>
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                Name: {user?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                Email: {user?.email || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                Role: {user?.role || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                Email Verified: {user?.is_verified ? '✅ Yes' : '❌ No'}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Phase 2 Features:</strong>
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                ✓ User Authentication (Login/Signup)
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                ✓ Email Verification
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                ✓ Password Management (Forgot/Reset/Change)
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                ✓ Token Refresh Mechanism
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                ✓ Route Guards (Auth/Guest/Verified)
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                ✓ Auth Context Provider
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            color: 'white',
          }}
        >
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            🎉 Authentication system is now fully functional!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default DashboardScreen;
