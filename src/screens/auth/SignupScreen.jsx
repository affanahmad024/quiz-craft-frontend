// Signup Screen
// QuizCraft themed with green gradient and animations
// Following ERPICA template design pattern

import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { Email, Lock, Person, Phone } from '@mui/icons-material';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { isValidEmail, validatePassword, passwordsMatch, isValidPhone } from '../../funcs/ValidationFuncs';
import useNetReq from '../../hooks/NetworkRequest';
import { signupUser } from '../../services/auth/AuthServices';
import toast from 'react-hot-toast';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';
import AuthNavbar from '../../components/navigation/AuthNavbar';

// Logo image - will be loaded from public folder
const logoImage = '/logo.png';

function SignupScreen() {
  const navigate = useNavigate();
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  // State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/api/v1/health').catch(() => {});
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Name validation
    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    // Phone number validation (optional)
    if (phoneNumber && !isValidPhone(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
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
      const signupData = {
        email: email.trim(),
        name: name.trim(),
        password,
        phone_number: phoneNumber.trim() || undefined,
      };

      const response = await signupUser(fetchData, abortContRef, { signupData });

      if (response.success) {
        toast.success('Account created! Please check your email to verify your account.');
        navigate(ROUTES.LOGIN, {
          state: { message: 'Please verify your email before logging in' }
        });
      } else {
        setApiError('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setApiError(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SetBrowserTabTitle title="Sign Up" />
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
          <AuthNavbar currentPage="signup" />

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
                      Manage Your Learning With Quiz Craft
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

                  {/* Right Side - Signup Form */}
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
                      Sign Up
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

                      {/* Name Label and Field */}
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
                          Full Name
                        </Typography>
                        <QuizCraftTextInput
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setErrors({ ...errors, name: '' });
                            setApiError('');
                          }}
                          error={errors.name}
                          fullWidth
                          required
                          startIcon={<Person sx={{ color: '#9CA3AF' }} />}
                          placeholder="Full Name"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#FAFBFC',
                            },
                          }}
                        />
                      </Box>

                      {/* Password Label and Field */}
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

                      {/* Confirm Password Label and Field */}
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
                          Confirm Password
                        </Typography>
                        <QuizCraftTextInput
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors({ ...errors, confirmPassword: '' });
                            setApiError('');
                          }}
                          error={errors.confirmPassword}
                          fullWidth
                          required
                          startIcon={<Lock sx={{ color: '#9CA3AF' }} />}
                          placeholder="Confirm Password"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#FAFBFC',
                            },
                          }}
                        />
                      </Box>

                      {/* Phone Number Label and Field (Optional) */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            color: '#1A1A1A',
                            fontWeight: 500,
                          }}
                        >
                          Phone Number (Optional)
                        </Typography>
                        <QuizCraftTextInput
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setErrors({ ...errors, phoneNumber: '' });
                            setApiError('');
                          }}
                          error={errors.phoneNumber}
                          fullWidth
                          startIcon={<Phone sx={{ color: '#9CA3AF' }} />}
                          placeholder="Phone Number"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#FAFBFC',
                            },
                          }}
                        />
                      </Box>

                      {/* Sign Up Button */}
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
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                      </QuizCraftButton>

                      {/* Login Link */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          Already Have An Account?{' '}
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
                            Login
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

export default SignupScreen;



