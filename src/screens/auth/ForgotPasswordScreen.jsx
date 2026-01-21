// Forgot Password Screen
// Following ERPICA template design pattern

import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { Email, Person } from '@mui/icons-material';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { isValidEmail } from '../../funcs/ValidationFuncs';
import useNetReq from '../../hooks/NetworkRequest';
import { forgotPassword } from '../../services/auth/AuthServices';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';
import AuthNavbar from '../../components/navigation/AuthNavbar';

const logoImage = '/logo.png';

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
    <>
      <SetBrowserTabTitle title="Forgot Password" />
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
          <AuthNavbar currentPage="forgot-password" />

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
                        Don't Worry!
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
                        We'll send you instructions to reset your password to your email address.
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
                            Secure password recovery process
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
                            Check your email for reset link
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
                            Link expires in 1 hour for security
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
                        Forgot Password
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                          mb: 4,
                        }}
                      >
                        Enter your email address and we'll send you a link to reset your password
                      </Typography>

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
                          </Box>
                        </Box>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          {/* Email Label and Field */}
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
                              Email
                            </Typography>
                            <QuizCraftTextInput
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: '' });
                              }}
                              error={errors.email}
                              fullWidth
                              required
                              autoFocus
                              startIcon={<Person sx={{ color: '#9CA3AF' }} />}
                              placeholder="Enter your email"
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
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordScreen;
