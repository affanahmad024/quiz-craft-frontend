// Verify Email Screen
// Following Phoenix pattern

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import useNetReq from '../../hooks/NetworkRequest';
import { verifyEmail, resendVerification } from '../../services/auth/AuthServices';
import toast from 'react-hot-toast';
import { PageTransition, FadeInView } from '../../components/animations';
import SetBrowserTabTitle from '../../layout/SetBrowserTabTitle';

function VerifyEmailScreen() {
  const [searchParams] = useSearchParams();
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  const userId = searchParams.get('userId');
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
    <PageTransition>
      <SetBrowserTabTitle title="Verify Email" />
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
                  Email Verification
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {verificationStatus === 'verifying' && 'Verifying your email address...'}
                  {verificationStatus === 'success' && 'Your email has been verified!'}
                  {verificationStatus === 'error' && 'Verification failed'}
                </Typography>
              </Box>

              {verificationStatus === 'verifying' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={60} sx={{ color: '#0D5C3F' }} />
                  <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary' }}>
                    Please wait while we verify your email...
                  </Typography>
                </Box>
              )}

              {verificationStatus === 'success' && (
                <Box>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Your email has been successfully verified! You can now login to your account.
                  </Alert>
                  <QuizCraftButton
                    component={RouterLink}
                    to={ROUTES.LOGIN}
                    variant="contained"
                    fullWidth
                    size="large"
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
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Need a new verification link? Enter your email below:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          fontSize: '16px',
                        }}
                      />
                      <QuizCraftButton
                        onClick={handleResendVerification}
                        variant="outlined"
                        loading={isResending}
                        disabled={!email}
                      >
                        Resend
                      </QuizCraftButton>
                    </Box>
                  </Box>

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
              )}
            </Box>
          </FadeInView>
        </Container>
      </Box>
    </PageTransition>
  );
}

export default VerifyEmailScreen;
