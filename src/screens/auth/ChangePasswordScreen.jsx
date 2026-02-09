// Change Password Screen
// Modern design matching login page format
// Following Phoenix pattern

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Alert,
  IconButton,
} from '@mui/material';
import { Lock, Shield, Security, VerifiedUser } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { validatePassword, passwordsMatch } from '../../funcs/ValidationFuncs';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
import useNetReq from '../../hooks/NetworkRequest';
import { changePassword } from '../../services/auth/AuthServices';
import toast from 'react-hot-toast';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';

// Logo image - will be loaded from public folder
const logoImage = '/logo.png';

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
  const [apiError, setApiError] = useState('');

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
    setApiError('');

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
      } else {
        setApiError(response.message || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setApiError('An error occurred while changing password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.PROFILE);
  };

  return (
    <>
      <SetBrowserTabTitle title="Change Password" />
      <PageTransition variant="fade">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F8F9FA',
          }}
        >
          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: { xs: 3, md: 4 },
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
                    {/* Left Side - Security Information */}
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        p: { xs: 3, sm: 4, md: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: '#FAFBFC',
                        minHeight: { xs: 'auto', md: '550px' },
                        width: { xs: '100%', sm: '50%' },
                        flexBasis: { xs: '100%', sm: '50%' },
                        maxWidth: { xs: '100%', sm: '50%' },
                      }}
                    >
                      {/* Back Button */}
                      <Box sx={{ mb: 2 }}>
                        <IconButton
                          onClick={handleBack}
                          sx={{
                            color: '#4B5563',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            },
                          }}
                        >
                          <ArrowBackIcon />
                        </IconButton>
                      </Box>

                      {/* Logo */}
                      <Box sx={{ mb: 3 }}>
                        <Box
                          component="img"
                          src={logoImage}
                          alt="QuizCraft Logo"
                          sx={{
                            height: { xs: 50, sm: 60, md: 70 },
                            width: 'auto',
                            mb: 1.5,
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
                          mb: 0.75,
                          color: '#1A1A1A',
                          fontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.65rem' },
                        }}
                      >
                        Secure Your Account
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: '#6B7280',
                          mb: 3,
                          lineHeight: 1.5,
                          fontSize: { xs: '0.9rem', md: '0.95rem' },
                        }}
                      >
                        Keep your account safe by regularly updating your password
                      </Typography>

                      {/* Security Tips */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Shield sx={{ color: 'white', fontSize: '1.1rem' }} />
                            </Box>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1A1A1A',
                                  mb: 0.3,
                                  fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                }}
                              >
                                Strong Password Protection
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#6B7280',
                                  fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                  lineHeight: 1.5,
                                }}
                              >
                                Use a combination of uppercase, lowercase letters, numbers, and special characters for maximum security.
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <VerifiedUser sx={{ color: 'white', fontSize: '1.1rem' }} />
                            </Box>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1A1A1A',
                                  mb: 0.3,
                                  fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                }}
                              >
                                Unique Password
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#6B7280',
                                  fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                  lineHeight: 1.5,
                                }}
                              >
                                Don't reuse passwords from other accounts. Keep your QuizCraft password unique and secure.
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Security sx={{ color: 'white', fontSize: '1.1rem' }} />
                            </Box>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1A1A1A',
                                  mb: 0.3,
                                  fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                }}
                              >
                                Regular Updates
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#6B7280',
                                  fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                  lineHeight: 1.5,
                                }}
                              >
                                Change your password regularly to maintain account security and protect your learning data.
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Right Side - Change Password Form */}
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        p: { xs: 3, sm: 4, md: 5 },
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
                          mb: 3,
                          fontSize: { xs: '1.5rem', sm: '1.65rem', md: '1.75rem' },
                        }}
                      >
                        Change Password
                      </Typography>

                      <form onSubmit={handleSubmit}>
                        {/* API Error Alert */}
                        {apiError && (
                          <Alert severity="error" sx={{ mb: 2.5 }}>
                            {apiError}
                          </Alert>
                        )}

                        {/* Current Password */}
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
                            Current Password
                          </Typography>
                          <QuizCraftTextInput
                            type="password"
                            value={currentPassword}
                            onChange={(e) => {
                              setCurrentPassword(e.target.value);
                              setErrors({ ...errors, currentPassword: '' });
                              setApiError('');
                            }}
                            error={errors.currentPassword}
                            fullWidth
                            required
                            autoFocus
                            startIcon={<Lock sx={{ color: '#9CA3AF' }} />}
                            placeholder="Enter current password"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FAFBFC',
                              },
                            }}
                          />
                        </Box>

                        {/* New Password */}
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
                            New Password
                          </Typography>
                          <QuizCraftTextInput
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setErrors({ ...errors, newPassword: '' });
                              setApiError('');
                            }}
                            error={errors.newPassword}
                            fullWidth
                            required
                            startIcon={<Lock sx={{ color: '#9CA3AF' }} />}
                            placeholder="Enter new password"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FAFBFC',
                              },
                            }}
                          />
                        </Box>

                        {/* Confirm New Password */}
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
                            Confirm New Password
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
                            placeholder="Re-enter new password"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FAFBFC',
                              },
                            }}
                          />
                        </Box>

                        {/* Password Requirements */}
                        <Box
                          sx={{
                            mb: 2.5,
                            p: 2,
                            backgroundColor: '#F9FAFB',
                            borderRadius: 2,
                            border: '1px solid #E5E7EB',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#4B5563',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              display: 'block',
                              mb: 0.75,
                            }}
                          >
                            Password must contain:
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6B7280',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              • At least 8 characters
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6B7280',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              • One uppercase letter (A-Z)
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6B7280',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              • One lowercase letter (a-z)
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6B7280',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              • One number (0-9)
                            </Typography>
                          </Box>
                        </Box>

                        {/* Change Password Button */}
                        <QuizCraftButton
                          type="submit"
                          fullWidth
                          loading={isLoading}
                          sx={{
                            background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                            color: 'white',
                            py: 1.5,
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
                            },
                          }}
                        >
                          {isLoading ? 'Updating Password...' : 'Update Password'}
                        </QuizCraftButton>
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

export default ChangePasswordScreen;
