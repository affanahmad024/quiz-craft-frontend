// Login Screen
// QuizCraft themed with green gradient and animations
// Following ERPICA template design pattern

import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Email, Lock, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';
import { isValidEmail } from '../../funcs/ValidationFuncs';
import AuthNavbar from '../../components/navigation/AuthNavbar';

// Logo image - will be loaded from public folder
const logoImage = '/logo.png';

function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
            flexDirection: 'column',
            backgroundColor: '#F8F9FA',
          }}
        >
          {/* Top Navigation Bar */}
          <AuthNavbar currentPage="login" />

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
                    {/* Left Side - Logo, Company Name & Features */}
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
                        minHeight: { xs: 'auto', md: '600px' },
                        width: { xs: '100%', sm: '50%' },
                        flexBasis: { xs: '100%', sm: '50%' },
                        maxWidth: { xs: '100%', sm: '50%' },
                      }}
                    >
                      {/* Logo and Company Name */}
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
                          mb: 1,
                          color: '#1A1A1A',
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        }}
                      >
                        Manage Your Learning With -
                      </Typography>

                      {/* Features List */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
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
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1A1A1A',
                                  mb: 0.5,
                                  fontSize: { xs: '0.95rem', md: '1rem' },
                                }}
                              >
                                All-in-one Quiz Platform
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#6B7280',
                                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                                  lineHeight: 1.6,
                                }}
                              >
                                Create and take interactive quizzes from one unified dashboard—manage all your learning activities seamlessly.
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
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
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1A1A1A',
                                  mb: 0.5,
                                  fontSize: { xs: '0.95rem', md: '1rem' },
                                }}
                              >
                                Customizable To Your Learning
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#6B7280',
                                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                                  lineHeight: 1.6,
                                }}
                              >
                                Enable only the topics you need and customize settings based on how you learn best.
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
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
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1A1A1A',
                                  mb: 0.5,
                                  fontSize: { xs: '0.95rem', md: '1rem' },
                                }}
                              >
                                Built-in Progress Tracking & Analytics
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#6B7280',
                                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                                  lineHeight: 1.6,
                                }}
                              >
                                Track your performance, view detailed analytics, and monitor your learning journey through integrated reports.
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Right Side - Login Form */}
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
                      {/* Form Header */}
                      <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                          fontWeight: 700,
                          color: '#1A1A1A',
                          mb: 4,
                          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                        }}
                      >
                        Sign In
                      </Typography>

                      <form onSubmit={handleSubmit}>
                        {/* API Error Alert */}
                        {apiError && (
                          <Alert severity="error" sx={{ mb: 3 }}>
                            {apiError}
                          </Alert>
                        )}

                        {/* Email Label and Field */}
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
                            Email
                          </Typography>
                          <QuizCraftTextInput
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
                            startIcon={<Person sx={{ color: '#9CA3AF' }} />}
                            placeholder="Email"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FAFBFC',
                              },
                            }}
                          />
                        </Box>

                        {/* Password Label and Field */}
                        <Box sx={{ mb: 2 }}>
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
                            Password
                          </Typography>
                          <QuizCraftTextInput
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
                            startIcon={<Lock sx={{ color: '#9CA3AF' }} />}
                            placeholder="Password"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FAFBFC',
                              },
                            }}
                          />
                        </Box>

                        {/* Remember Me and Forgot Password */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                sx={{
                                  color: '#0D5C3F',
                                  '&.Mui-checked': {
                                    color: '#0D5C3F',
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ color: '#4B5563', fontSize: '0.875rem' }}>
                                Remember Me
                              </Typography>
                            }
                          />
                          <Link
                            component={RouterLink}
                            to={ROUTES.FORGOT_PASSWORD}
                            sx={{
                              color: '#2563EB',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Forgot Password
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
                          {isLoading ? 'Logging in...' : 'Log In'}
                        </QuizCraftButton>

                        {/* Sign Up Link */}
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Don't Have An Account?{' '}
                            <Link
                              component={RouterLink}
                              to={ROUTES.SIGNUP}
                              sx={{
                                color: '#2563EB',
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

export default LoginScreen;
