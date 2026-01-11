// Reset Password Screen
// Following Phoenix pattern

import { useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { validatePassword, passwordsMatch } from '../../funcs/ValidationFuncs';
import useNetReq from '../../hooks/NetworkRequest';
import { resetPassword } from '../../services/auth/AuthServices';
import toast from 'react-hot-toast';

function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Check if userId and token are present
  const hasValidParams = userId && token;

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!passwordsMatch(password, confirmPassword)) {
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
      const response = await resetPassword(fetchData, abortContRef, {
        userId,
        token,
        newPassword: password,
      });

      if (response.success) {
        toast.success('Password reset successful! You can now login with your new password.');
        navigate(ROUTES.LOGIN);
      }
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Reset Password
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Enter your new password
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            {!hasValidParams ? (
              <Box>
                <Alert severity="error" sx={{ mb: 3 }}>
                  Invalid or missing reset link parameters. Please request a new password reset.
                </Alert>
                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component={RouterLink}
                    to={ROUTES.FORGOT_PASSWORD}
                    sx={{ textDecoration: 'none', fontWeight: 600, mr: 2 }}
                  >
                    Request New Reset Link
                  </Link>
                  <Link
                    component={RouterLink}
                    to={ROUTES.LOGIN}
                    sx={{ textDecoration: 'none', fontWeight: 600 }}
                  >
                    Back to Login
                  </Link>
                </Box>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <QuizCraftTextInput
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  fullWidth
                  autoFocus
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
                  Reset Password
                </QuizCraftButton>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Remember your password?{' '}
                    <Link
                      component={RouterLink}
                      to={ROUTES.LOGIN}
                      sx={{ textDecoration: 'none', fontWeight: 600 }}
                    >
                      Login
                    </Link>
                  </Typography>
                </Box>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ResetPasswordScreen;
