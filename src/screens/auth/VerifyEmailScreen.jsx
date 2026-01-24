// Verify Email Screen
// Following ERPICA template design pattern

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import useNetReq from '../../hooks/NetworkRequest';
import { verifyEmail, resendVerification } from '../../services/auth/AuthServices';
import toast from 'react-hot-toast';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';
import AuthNavbar from '../../components/navigation/AuthNavbar';

const logoImage = '/logo.png';

function VerifyEmailScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  const userId = searchParams.get('user_id');
  const token = searchParams.get('token');

  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');

  // Check if userId and token are present
  const hasValidParams = userId && token;

  // Auto-verify on mount
  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!hasValidParams) {
        setVerificationStatus('error');
        setErrorMessage('Invalid verification link. Please check your email or request a new verification link.');
        return;
      }

      try {
        const response = await verifyEmail(fetchData, abortContRef, { userId, token });

        if (response.success) {
          setVerificationStatus('success');
          toast.success('Email verified successfully!');
        } else {
          setVerificationStatus('error');
          setErrorMessage(response.error?.message || 'Failed to verify email. The link may have expired.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyUserEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);

    try {
      const response = await resendVerification(fetchData, abortContRef, { email: email.trim() });

      if (response.success) {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <SetBrowserTabTitle title="Verify Email" />
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
          <AuthNavbar currentPage="verify-email" />

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
                        Email Verification
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
                        We're verifying your email address to ensure the security of your account.
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
                            Secure email verification process
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
                            One-time verification link
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
                            Instant account activation
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Right Side - Verification Status */}
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
                        {verificationStatus === 'verifying' && 'Verifying...'}
                        {verificationStatus === 'success' && 'Verified!'}
                        {verificationStatus === 'error' && 'Verification Failed'}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                          mb: 4,
                        }}
                      >
                        {verificationStatus === 'verifying' && 'Please wait while we verify your email address'}
                        {verificationStatus === 'success' && 'Your email has been successfully verified'}
                        {verificationStatus === 'error' && 'We encountered an issue verifying your email'}
                      </Typography>

                      {verificationStatus === 'verifying' && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <CircularProgress
                            size={60}
                            sx={{
                              color: '#0D5C3F',
                              mb: 3,
                            }}
                          />
                          <Typography variant="body1" sx={{ color: '#6B7280' }}>
                            This should only take a moment...
                          </Typography>
                        </Box>
                      )}

                      {verificationStatus === 'success' && (
                        <Box>
                          <Alert severity="success" sx={{ mb: 3 }}>
                            Your email has been successfully verified! You can now login to your account.
                          </Alert>
                          <QuizCraftButton
                            onClick={() => navigate(ROUTES.LOGIN)}
                            fullWidth
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
                            Go to Login
                          </QuizCraftButton>
                        </Box>
                      )}

                      {verificationStatus === 'error' && (
                        <Box>
                          <Alert severity="error" sx={{ mb: 3 }}>
                            {errorMessage}
                          </Alert>

                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1,
                                color: '#1A1A1A',
                                fontWeight: 500,
                              }}
                            >
                              Need a new verification link?
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 2,
                                color: '#6B7280',
                              }}
                            >
                              Enter your email below to receive a new verification link
                            </Typography>
                            <QuizCraftTextInput
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              fullWidth
                              startIcon={<Email sx={{ color: '#9CA3AF' }} />}
                              placeholder="Enter your email"
                              sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#FAFBFC',
                                },
                              }}
                            />
                            <QuizCraftButton
                              onClick={handleResendVerification}
                              fullWidth
                              loading={isResending}
                              disabled={!email}
                              sx={{
                                background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                                color: 'white',
                                py: 1.75,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: 2,
                                textTransform: 'none',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
                                },
                                '&:disabled': {
                                  background: '#E5E7EB',
                                  color: '#9CA3AF',
                                },
                              }}
                            >
                              {isResending ? 'Sending...' : 'Resend Verification Email'}
                            </QuizCraftButton>
                          </Box>

                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              Already verified?{' '}
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
                        </Box>
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

export default VerifyEmailScreen;
