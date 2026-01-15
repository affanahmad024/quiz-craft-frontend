// Forgot Password Screen
// Following Phoenix pattern

import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { isValidEmail } from '../../funcs/ValidationFuncs';
import useNetReq from '../../hooks/NetworkRequest';
import { forgotPassword } from '../../services/auth/AuthServices';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';

function ForgotPasswordScreen() {
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
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
      // Always show success message for security (don't reveal if email exists)
      await forgotPassword(fetchData, abortContRef, { email: email.trim() });
      setShowSuccess(true);
    } catch (error) {
      // Even on error, show success for security
      console.error('Forgot password error:', error);
      setShowSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <SetBrowserTabTitle title="Forgot Password" />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <FadeInView>
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 4,
                p: 6,
                maxWidth: 500,
                mx: 'auto',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Logo */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img
                  src="/logo.png"
                  alt="QuizCraft Logo"
                  style={{ height: '60px', marginBottom: '24px' }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#0D5C3F',
                  }}
                >
                  Forgot Password?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Enter your email to receive a password reset link
                </Typography>
              </Box>

              {showSuccess ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    If an account exists with this email, you will receive password reset instructions shortly.
                    Please check your inbox and spam folder.
                  </Alert>
                  <Box sx={{ textAlign: 'center' }}>
                    <Link
                      component={RouterLink}
                      to={ROUTES.LOGIN}
                      sx={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#0D5C3F',
                        '&:hover': {
                          color: '#7ED957',
                        },
                      }}
                    >
                      Back to Login
                    </Link>
                  </Box>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <QuizCraftTextInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    fullWidth
                    autoFocus
                    sx={{ mb: 3 }}
                  />

                  <QuizCraftButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    loading={isLoading}
                  >
                    Send Reset Link
                  </QuizCraftButton>

                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Remember your password?{' '}
                      <Link
                        component={RouterLink}
                        to={ROUTES.LOGIN}
                        sx={{
                          textDecoration: 'none',
                          fontWeight: 600,
                          color: '#0D5C3F',
                          '&:hover': {
                            color: '#7ED957',
                          },
                        }}
                      >
                        Login
                      </Link>
                    </Typography>
                  </Box>
                </form>
              )}
            </Box>
          </FadeInView>
        </Container>
      </Box>
    </PageTransition>
  );
}

export default ForgotPasswordScreen;
