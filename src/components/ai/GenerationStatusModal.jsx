// Generation Status Modal Component
// Polls and displays AI generation job status
// Following Phoenix pattern

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import QuizCraftButton from '../buttons/QuizCraftButton';
import useNetReq from '../../hooks/NetworkRequest';
import { getGenerationStatus } from '../../services/ai/AIServices';
import {
  AI_GENERATION_STATUS,
  AI_POLLING_INTERVAL_MS,
} from '../../constants/AIConstants';

/**
 * GenerationStatusModal Component
 * Displays generation progress and polls for status updates
 */
function GenerationStatusModal({ open, onClose, generationId, onComplete }) {
  const { fetchData } = useNetReq();

  const [status, setStatus] = useState(AI_GENERATION_STATUS.PENDING);
  const [quizId, setQuizId] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const pollingIntervalRef = useRef(null);
  const abortRef = useRef(null);

  // Status messages
  const getStatusMessage = () => {
    switch (status) {
      case AI_GENERATION_STATUS.PENDING:
        return 'Initializing AI generation...';
      case AI_GENERATION_STATUS.PROCESSING:
        return 'AI is generating your quiz...';
      case AI_GENERATION_STATUS.COMPLETED:
        return 'Quiz generated successfully!';
      case AI_GENERATION_STATUS.FAILED:
        return 'Generation failed';
      default:
        return 'Processing...';
    }
  };

  // Poll for status
  const pollStatus = async () => {
    if (!generationId) return;

    const response = await getGenerationStatus(fetchData, abortRef, { generationId });

    if (response.success) {
      // Handle nested data structure: response.data.data.* or response.data.*
      const responseData = response.data?.data || response.data;
      const jobStatus = responseData?.status;
      const jobQuizId = responseData?.quiz_id;
      const jobError = responseData?.error;

      setStatus(jobStatus);

      // Update progress based on status
      if (jobStatus === AI_GENERATION_STATUS.PENDING) {
        setProgress(10);
      } else if (jobStatus === AI_GENERATION_STATUS.PROCESSING) {
        setProgress(50);
      } else if (jobStatus === AI_GENERATION_STATUS.COMPLETED) {
        setProgress(100);
        setQuizId(jobQuizId);
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      } else if (jobStatus === AI_GENERATION_STATUS.FAILED) {
        setProgress(100);
        setError(jobError || 'Generation failed. Please try again.');
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    } else {
      // If polling fails, treat as error
      setStatus(AI_GENERATION_STATUS.FAILED);
      setError(response.error?.message || 'Failed to check generation status');
      setProgress(100);
      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  };

  // Start polling when modal opens
  useEffect(() => {
    if (open && generationId) {
      // Initial poll
      pollStatus();

      // Set up polling interval
      pollingIntervalRef.current = setInterval(() => {
        pollStatus();
      }, AI_POLLING_INTERVAL_MS);

      // Cleanup
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (abortRef.current) {
          abortRef.current.abort();
        }
      };
    }
  }, [open, generationId]);

  // Auto-close after 5 seconds and notify user
  useEffect(() => {
    if (open && generationId) {
      const autoCloseTimer = setTimeout(() => {
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        // Close modal
        onClose();
        // Show notification
        import('react-hot-toast').then(({ toast }) => {
          toast.success(
            'Your quiz is being generated in the background. We\'ll notify you once it\'s complete!',
            { duration: 5000 }
          );
        });
      }, 5000); // 5 seconds

      return () => clearTimeout(autoCloseTimer);
    }
  }, [open, generationId, onClose]);

  // Handle view quiz
  const handleViewQuiz = () => {
    if (quizId) {
      onComplete(quizId);
    }
  };

  // Handle close
  const handleClose = () => {
    // Only allow closing if completed or failed
    if (status === AI_GENERATION_STATUS.COMPLETED || status === AI_GENERATION_STATUS.FAILED) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
      disableEscapeKeyDown={status === AI_GENERATION_STATUS.PENDING || status === AI_GENERATION_STATUS.PROCESSING}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3,
          }}
        >
          {/* Status Icon */}
          {status === AI_GENERATION_STATUS.COMPLETED ? (
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: '#43e97b',
              }}
            />
          ) : status === AI_GENERATION_STATUS.FAILED ? (
            <ErrorIcon
              sx={{
                fontSize: 80,
                color: '#f5576c',
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
              }}
            >
              <CircularProgress
                size={80}
                thickness={4}
                sx={{
                  color: '#667eea',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 32, color: '#667eea' }} />
              </Box>
            </Box>
          )}

          {/* Status Message */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {getStatusMessage()}
            </Typography>
            {status === AI_GENERATION_STATUS.PROCESSING && (
              <Typography variant="body2" color="text.secondary">
                This usually takes 10-30 seconds. Please don't close this window.
              </Typography>
            )}
            {status === AI_GENERATION_STATUS.FAILED && error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Box>

          {/* Progress Bar */}
          {(status === AI_GENERATION_STATUS.PENDING || status === AI_GENERATION_STATUS.PROCESSING) && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#E8E8E8',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {progress}% complete
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          {status === AI_GENERATION_STATUS.COMPLETED && (
            <QuizCraftButton
              variant="contained"
              onClick={handleViewQuiz}
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
                },
              }}
            >
              View & Edit Quiz
            </QuizCraftButton>
          )}

          {status === AI_GENERATION_STATUS.FAILED && (
            <QuizCraftButton
              variant="outlined"
              onClick={handleClose}
              fullWidth
              sx={{
                borderColor: '#DFE6E9',
                color: '#636E72',
                '&:hover': {
                  borderColor: '#B2BEC3',
                  backgroundColor: alpha('#636E72', 0.05),
                },
              }}
            >
              Close
            </QuizCraftButton>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

GenerationStatusModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  generationId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default GenerationStatusModal;
