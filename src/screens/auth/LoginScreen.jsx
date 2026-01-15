// Login Screen
// QuizCraft themed with green gradient and animations
// Following Phoenix pattern

import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';
import { isValidEmail } from '../../funcs/ValidationFuncs';

// Logo image - will be loaded from public folder
const logoImage = '/logo.png';

function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await login({ email, password });

      if (success) {
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
        navigate(from, { replace: true });
      } else {
        setApiError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SetBrowserTabTitle title="Login" />
      <PageTransition variant="fade">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
            py: 4,
            px: 2,
          }}
        >
          <Container maxWidth="lg">
            <FadeInView delay={0.1}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                }}
              >
                <Grid container spacing={0}>
                  {/* Left Side - Welcome Text & Features */}
                  <Grid
                    item
                    xs={6}
                    sx={{
                      background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                      color: 'white',
                      p: { xs: 3, sm: 4, md: 8 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minHeight: { xs: '400px', md: '600px' },
                    }}
                  >
                    {/* Logo */}
                    <Box
                      component="img"
                      src={logoImage}
                      alt="QuizCraft Logo"
                      sx={{
                        height: { xs: 50, sm: 60 },
                        width: 'auto',
                        mb: 4,
                        filter: 'brightness(0) invert(1)',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />

                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                      }}
                    >
                      Welcome Back!
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 4,
                        opacity: 0.95,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                      }}
                    >
                      Continue your learning journey with QuizCraft
                    </Typography>

                    {/* Features List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                        </Box>
                        <Typography variant="body1">Create and take interactive quizzes</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                        </Box>
                        <Typography variant="body1">Track your progress and achievements</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                        </Box>
                        <Typography variant="body1">Join a community of learners</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Side - Login Form */}
                  <Grid
                    item
                    xs={6}
                    sx={{
                      p: { xs: 3, sm: 4, md: 8 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                    }}
                  >
                    {/* Form Header */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        Sign In
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enter your credentials to access your account
                      </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                      {/* API Error Alert */}
                      {apiError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                          {apiError}
                        </Alert>
                      )}

                      {/* Email Field */}
                      <QuizCraftTextInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors({ ...errors, email: '' });
                          setApiError('');
                        }}
                        error={errors.email}
                        fullWidth
                        required
                        startIcon={<Email />}
                        placeholder="Enter your email"
                        sx={{ mb: 2.5 }}
                      />

                      {/* Password Field */}
                      <QuizCraftTextInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors({ ...errors, password: '' });
                          setApiError('');
                        }}
                        error={errors.password}
                        fullWidth
                        required
                        startIcon={<Lock />}
                        placeholder="Enter your password"
                        sx={{ mb: 1.5 }}
                      />

                      {/* Forgot Password Link */}
                      <Box sx={{ textAlign: 'right', mb: 3 }}>
                        <Link
                          component={RouterLink}
                          to={ROUTES.FORGOT_PASSWORD}
                          sx={{
                            color: '#0D5C3F',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Forgot Password?
                        </Link>
                      </Box>

                      {/* Login Button */}
                      <QuizCraftButton
                        type="submit"
                        fullWidth
                        loading={isLoading}
                        sx={{
                          background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                          color: 'white',
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
                          },
                        }}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </QuizCraftButton>

                      {/* Divider */}
                      <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          OR
                        </Typography>
                      </Divider>

                      {/* Sign Up Link */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Don't have an account?{' '}
                          <Link
                            component={RouterLink}
                            to={ROUTES.SIGNUP}
                            sx={{
                              color: '#0D5C3F',
                              fontWeight: 600,
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Sign Up
                          </Link>
                        </Typography>
                      </Box>
                    </form>

                    {/* Back to Home */}
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <Link
                        component={RouterLink}
                        to={ROUTES.HOME}
                        sx={{
                          color: '#0D5C3F',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        ← Back to Home
                      </Link>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </FadeInView>
          </Container>
        </Box>
      </PageTransition>
    </>
  );
}

export default LoginScreen;
