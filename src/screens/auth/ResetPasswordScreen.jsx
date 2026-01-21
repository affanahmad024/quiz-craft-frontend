// Reset Password Screen
// Following ERPICA template design pattern

import { useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { validatePassword, passwordsMatch } from '../../funcs/ValidationFuncs';
import useNetReq from '../../hooks/NetworkRequest';
import { resetPassword } from '../../services/auth/AuthServices';
import toast from 'react-hot-toast';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';
import AuthNavbar from '../../components/navigation/AuthNavbar';

const logoImage = '/logo.png';

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
    <>
      <SetBrowserTabTitle title="Reset Password" />
      <PageTransition variant="fade">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F8F9FA',
          }}
        >
          {/* Top Navigation Bar */}
          <AuthNavbar currentPage="reset-password" />

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: { xs: 4, md: 6 },
              px: 2,
            }}
          >
            <Container maxWidth="xl">
              <FadeInView delay={0.1}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <Grid container spacing={0}>
                    {/* Left Side - Logo & Info */}
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        p: { xs: 4, sm: 5, md: 6, lg: 8 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: '#FAFBFC',
                        minHeight: { xs: 'auto', md: '500px' },
                        width: { xs: '100%', sm: '50%' },
                        flexBasis: { xs: '100%', sm: '50%' },
                        maxWidth: { xs: '100%', sm: '50%' },
                      }}
                    >
                      {/* Logo */}
                      <Box sx={{ mb: 4 }}>
                        <Box
                          component="img"
                          src={logoImage}
                          alt="QuizCraft Logo"
                          sx={{
                            height: { xs: 60, sm: 80, md: 100 },
                            width: 'auto',
                            mb: 2,
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </Box>

                      {/* Main Heading */}
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: '#1A1A1A',
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        }}
                      >
                        Create New Password
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: '#6B7280',
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          lineHeight: 1.6,
                          mb: 3,
                        }}
                      >
                        Your new password must be different from previously used passwords.
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '4px',
                              background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              mt: 0.5,
                            }}
                          >
                            <Typography sx={{ fontSize: '0.875rem', color: 'white' }}>✓</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            At least 8 characters long
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '4px',
                              background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              mt: 0.5,
                            }}
                          >
                            <Typography sx={{ fontSize: '0.875rem', color: 'white' }}>✓</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Contains uppercase and lowercase letters
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '4px',
                              background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              mt: 0.5,
                            }}
                          >
                            <Typography sx={{ fontSize: '0.875rem', color: 'white' }}>✓</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Contains at least one number
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Right Side - Form */}
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        p: { xs: 4, sm: 5, md: 6, lg: 8 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        width: { xs: '100%', sm: '50%' },
                        flexBasis: { xs: '100%', sm: '50%' },
                        maxWidth: { xs: '100%', sm: '50%' },
                      }}
                    >
                      <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                          fontWeight: 700,
                          color: '#1A1A1A',
                          mb: 2,
                          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                        }}
                      >
                        Reset Password
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                          mb: 4,
                        }}
                      >
                        Enter your new password below
                      </Typography>

                      {!hasValidParams ? (
                        <Box>
                          <Alert severity="error" sx={{ mb: 3 }}>
                            Invalid or missing reset link parameters. Please request a new password reset.
                          </Alert>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Link
                              component={RouterLink}
                              to={ROUTES.FORGOT_PASSWORD}
                              sx={{
                                color: '#2563EB',
                                fontWeight: 600,
                                textDecoration: 'none',
                                textAlign: 'center',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              Request New Reset Link
                            </Link>
                            <Link
                              component={RouterLink}
                              to={ROUTES.LOGIN}
                              sx={{
                                color: '#2563EB',
                                fontWeight: 600,
                                textDecoration: 'none',
                                textAlign: 'center',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              Back to Login
                            </Link>
                          </Box>
                        </Box>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          {/* New Password Label and Field */}
                          <Box sx={{ mb: 2.5 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1,
                                color: '#1A1A1A',
                                fontWeight: 500,
                                '&::after': {
                                  content: '" *"',
                                  color: '#EF4444',
                                },
                              }}
                            >
                              New Password
                            </Typography>
                            <QuizCraftTextInput
                              type="password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors({ ...errors, password: '' });
                              }}
                              error={errors.password}
                              fullWidth
                              required
                              autoFocus
                              startIcon={<Lock sx={{ color: '#9CA3AF' }} />}
                              placeholder="Enter new password"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#FAFBFC',
                                },
                              }}
                            />
                          </Box>

                          {/* Confirm Password Label and Field */}
                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1,
                                color: '#1A1A1A',
                                fontWeight: 500,
                                '&::after': {
                                  content: '" *"',
                                  color: '#EF4444',
                                },
                              }}
                            >
                              Confirm New Password
                            </Typography>
                            <QuizCraftTextInput
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrors({ ...errors, confirmPassword: '' });
                              }}
                              error={errors.confirmPassword}
                              fullWidth
                              required
                              startIcon={<Lock sx={{ color: '#9CA3AF' }} />}
                              placeholder="Confirm new password"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#FAFBFC',
                                },
                              }}
                            />
                          </Box>

                          {/* Submit Button */}
                          <QuizCraftButton
                            type="submit"
                            fullWidth
                            loading={isLoading}
                            sx={{
                              background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                              color: 'white',
                              py: 1.75,
                              fontSize: '1rem',
                              fontWeight: 600,
                              borderRadius: 2,
                              textTransform: 'none',
                              mb: 3,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
                              },
                            }}
                          >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                          </QuizCraftButton>

                          {/* Back to Login Link */}
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              Remember your password?{' '}
                              <Link
                                component={RouterLink}
                                to={ROUTES.LOGIN}
                                sx={{
                                  color: '#2563EB',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                Back to Login
                              </Link>
                            </Typography>
                          </Box>
                        </form>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </FadeInView>
            </Container>
          </Box>
        </Box>
      </PageTransition>
    </>
  );
}

export default ResetPasswordScreen;
