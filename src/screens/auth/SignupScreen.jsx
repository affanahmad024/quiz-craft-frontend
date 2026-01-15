// Signup Screen
// QuizCraft themed with green gradient and animations
// Following Phoenix pattern

import { useState, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Alert,
  Divider,
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
                        height: { xs: 35, sm: 50, md: 60 },
                        width: 'auto',
                        mb: { xs: 2, md: 4 },
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
                        mb: { xs: 1, md: 2 },
                        fontSize: { xs: '1.1rem', sm: '1.75rem', md: '2.5rem' },
                      }}
                    >
                      Join QuizCraft Today!
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: { xs: 2, md: 4 },
                        opacity: 0.95,
                        fontSize: { xs: '0.75rem', sm: '1rem', md: '1.1rem' },
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      Create engaging quizzes and start your learning journey
                    </Typography>

                    {/* Features List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        <Box
                          sx={{
                            width: { xs: 24, md: 36 },
                            height: { xs: 24, md: 36 },
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' } }}>✓</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' } }}>Free to get started</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        <Box
                          sx={{
                            width: { xs: 24, md: 36 },
                            height: { xs: 24, md: 36 },
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' } }}>✓</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' } }}>Create unlimited quizzes</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        <Box
                          sx={{
                            width: { xs: 24, md: 36 },
                            height: { xs: 24, md: 36 },
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' } }}>✓</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' } }}>Track your learning progress</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Side - Signup Form */}
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
                    <Box sx={{ mb: { xs: 2, md: 4 } }}>
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
                          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                        }}
                      >
                        Create Account
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.7rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'block' },
                        }}
                      >
                        Fill in your details to get started
                      </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                      {/* API Error Alert */}
                      {apiError && (
                        <Alert severity="error" sx={{ mb: { xs: 1.5, md: 3 }, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
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
                        startIcon={<Email sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} />}
                        placeholder="Enter your email"
                        sx={{ mb: { xs: 1.5, md: 2.5 } }}
                      />

                      {/* Name Field */}
                      <QuizCraftTextInput
                        label="Full Name"
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
                        startIcon={<Person />}
                        placeholder="Enter your full name"
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
                        sx={{ mb: 2.5 }}
                      />

                      {/* Confirm Password Field */}
                      <QuizCraftTextInput
                        label="Confirm Password"
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
                        startIcon={<Lock />}
                        placeholder="Confirm your password"
                        sx={{ mb: 2.5 }}
                      />

                      {/* Phone Number Field */}
                      <QuizCraftTextInput
                        label="Phone Number (Optional)"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setErrors({ ...errors, phoneNumber: '' });
                          setApiError('');
                        }}
                        error={errors.phoneNumber}
                        fullWidth
                        startIcon={<Phone />}
                        placeholder="Enter your phone number"
                        sx={{ mb: 3 }}
                      />

                      {/* Sign Up Button */}
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
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                      </QuizCraftButton>

                      {/* Divider */}
                      <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          OR
                        </Typography>
                      </Divider>

                      {/* Login Link */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Already have an account?{' '}
                          <Link
                            component={RouterLink}
                            to={ROUTES.LOGIN}
                            sx={{
                              color: '#0D5C3F',
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

export default SignupScreen;
