// Change Password Screen
// Following Phoenix pattern

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { validatePassword, passwordsMatch } from '../../funcs/ValidationFuncs';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
import useNetReq from '../../hooks/NetworkRequest';
import { changePassword } from '../../services/auth/AuthServices';
import toast from 'react-hot-toast';

function ChangePasswordScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN);
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    // Current password validation
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      newErrors.newPassword = passwordValidation.errors[0];
    }

    // Check if new password is different from current
    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (!passwordsMatch(newPassword, confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await changePassword(fetchData, abortContRef, {
        currentPassword,
        newPassword,
      });

      if (response.success) {
        toast.success('Password changed successfully!');
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Navigate back to profile
        navigate(ROUTES.PROFILE);
      }
    } catch (error) {
      console.error('Change password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.PROFILE);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Change Password
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Update your account password
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <QuizCraftTextInput
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                error={Boolean(errors.currentPassword)}
                helperText={errors.currentPassword}
                fullWidth
                autoFocus
                sx={{ mb: 2 }}
              />

              <QuizCraftTextInput
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword}
                fullWidth
                sx={{ mb: 2 }}
              />

              <QuizCraftTextInput
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                fullWidth
                sx={{ mb: 3 }}
              />

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Password must contain:
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  - At least 8 characters
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  - One uppercase letter
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  - One lowercase letter
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  - One number
                </Typography>
              </Box>

              <QuizCraftButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loading={isLoading}
              >
                Change Password
              </QuizCraftButton>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ChangePasswordScreen;
