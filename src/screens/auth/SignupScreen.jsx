// Signup Screen
// Following Phoenix pattern

import { useState, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  Card,
  CardContent,
} from '@mui/material';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { isValidEmail, validatePassword, passwordsMatch, isValidPhone } from '../../funcs/ValidationFuncs';
import useNetReq from '../../hooks/NetworkRequest';
import { signupUser } from '../../services/auth/AuthServices';
import toast from 'react-hot-toast';

function SignupScreen() {
  const navigate = useNavigate();
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      }
    } catch (error) {
      console.error('Signup error:', error);
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
            Create Account
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Join QuizCraft and start creating quizzes
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
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
                sx={{ mb: 2 }}
              />

              <QuizCraftTextInput
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
                fullWidth
                sx={{ mb: 2 }}
              />

              <QuizCraftTextInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
                fullWidth
                sx={{ mb: 2 }}
              />

              <QuizCraftTextInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                fullWidth
                sx={{ mb: 2 }}
              />

              <QuizCraftTextInput
                label="Phone Number (Optional)"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber}
                fullWidth
                sx={{ mb: 3 }}
              />

              <QuizCraftButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loading={isLoading}
              >
                Sign Up
              </QuizCraftButton>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
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
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default SignupScreen;
