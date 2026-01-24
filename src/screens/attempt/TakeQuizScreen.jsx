// Take Quiz Screen
// Interface for taking a quiz attempt (NTA Style)
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Collapse,
  Drawer,
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardDoubleArrowUp as KeyboardDoubleArrowUpIcon,
  KeyboardDoubleArrowDown as KeyboardDoubleArrowDownIcon,
} from '@mui/icons-material';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { toast } from 'react-hot-toast';

function TakeQuizScreen() {
  const { id, attemptId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { user } = useAuth();
  const {
    currentAttempt,
    userAnswers,
    isLoading,
    getAttempt,
    submitAnswer,
    finishAttempt,
  } = useAttempt();
  const { currentQuiz, getQuiz } = useQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [paletteCollapsed, setPaletteCollapsed] = useState(true);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);

  // Initialize attempt on mount
  useEffect(() => {
    const initializeAttempt = async () => {
      const response = await getAttempt(attemptId);
      if (!response.success) {
        toast.error(response.error || 'Failed to load attempt');
        navigate(ROUTES.ATTEMPT_LIST);
      }
    };

    initializeAttempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  // Fetch full quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      if (id) {
        const response = await getQuiz(id, true);
        if (!response.success) {
          toast.error(response.error || 'Failed to load quiz');
        }
      }
    };

    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load saved answers from userAnswers
  useEffect(() => {
    if (userAnswers && Object.keys(userAnswers).length > 0) {
      const answers = {};
      Object.keys(userAnswers).forEach((questionId) => {
        const answer = userAnswers[questionId];
        if (answer.answerId) {
          answers[questionId] = answer.answerId;
        }
      });
      setSelectedAnswers(answers);
    }
  }, [userAnswers]);

  // Mark current question as visited
  useEffect(() => {
    if (currentQuestion) {
      setVisitedQuestions((prev) => ({
        ...prev,
        [currentQuestion.id]: true,
      }));
    }
  }, [currentQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    if (!currentAttempt?.expires_at) return;

    const updateTimer = () => {
      const now = new Date();
      const expiresAt = new Date(currentAttempt.expires_at);
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeRemaining('00:00:00');
        handleTimeExpire();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentAttempt]);

  // Handle time expiration
  const handleTimeExpire = async () => {
    toast.error('Time expired! Submitting your quiz...');
    await handleFinishQuiz();
  };

  // Get current question
  const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex] || null;

  // Handle answer selection
  const handleAnswerSelect = (answerId) => {
    if (!currentQuestion) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  // Handle save and next
  const handleSaveAndNext = async () => {
    if (!currentQuestion) return;

    const answerId = selectedAnswers[currentQuestion.id];
    if (!answerId) {
      toast.error('Please select an answer');
      return;
    }

    // Save answer
    const response = await submitAnswer(currentAttempt.id, currentQuestion.id, answerId, null);

    if (response.success) {
      // Move to next question
      if (currentQuestionIndex < (currentQuiz.questions?.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } else {
      toast.error(response.error || 'Failed to save answer');
    }
  };

  // Handle clear response
  const handleClear = () => {
    if (!currentQuestion) return;

    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion.id];
      return newAnswers;
    });
  };

  // Handle save and mark for review
  const handleSaveAndMarkForReview = async () => {
    if (!currentQuestion) return;

    const answerId = selectedAnswers[currentQuestion.id];
    if (!answerId) {
      toast.error('Please select an answer before marking for review');
      return;
    }

    // Save answer
    const response = await submitAnswer(currentAttempt.id, currentQuestion.id, answerId, null);

    if (response.success) {
      // Mark for review
      setMarkedForReview((prev) => ({
        ...prev,
        [currentQuestion.id]: true,
      }));

      // Move to next question
      if (currentQuestionIndex < (currentQuiz.questions?.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } else {
      toast.error(response.error || 'Failed to save answer');
    }
  };

  // Handle mark for review and next
  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;

    // Just mark for review without saving answer
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    // Move to next question
    if (currentQuestionIndex < (currentQuiz.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (currentQuiz.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle direct question navigation
  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Handle submit quiz
  const handleSubmitClick = () => {
    setSubmitDialogOpen(true);
  };

  const handleFinishQuiz = async () => {
    if (!currentAttempt) return;

    setIsFinishing(true);
    const response = await finishAttempt(currentAttempt.id);
    setIsFinishing(false);

    if (response.success) {
      toast.success('Quiz submitted successfully!');
      navigate(buildRoute(ROUTES.ATTEMPT_RESULTS, { id: currentAttempt.id }));
    } else {
      toast.error(response.error || 'Failed to submit quiz');
    }
  };

  // Get question status
  const getQuestionStatus = (question) => {
    const questionId = question.id;
    const isVisited = visitedQuestions[questionId];
    const isAnswered = selectedAnswers[questionId];
    const isMarked = markedForReview[questionId];

    if (isAnswered && isMarked) {
      return 'answered-marked';
    } else if (isAnswered) {
      return 'answered';
    } else if (isMarked) {
      return 'marked';
    } else if (isVisited) {
      return 'not-answered';
    } else {
      return 'not-visited';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'not-visited':
        return '#B0BEC5';
      case 'not-answered':
        return '#FF5722';
      case 'answered':
        return '#4CAF50';
      case 'marked':
        return '#9C27B0';
      case 'answered-marked':
        return '#9C27B0';
      default:
        return '#B0BEC5';
    }
  };

  // Calculate stats
  const totalQuestions = currentQuiz?.questions?.length || 0;
  const notVisited = currentQuiz?.questions?.filter(
    (q) => !visitedQuestions[q.id]
  ).length || 0;
  const notAnswered = currentQuiz?.questions?.filter(
    (q) => visitedQuestions[q.id] && !selectedAnswers[q.id] && !markedForReview[q.id]
  ).length || 0;
  const answered = Object.keys(selectedAnswers).filter(
    (qid) => !markedForReview[qid]
  ).length;
  const markedCount = Object.keys(markedForReview).filter(
    (qid) => !selectedAnswers[qid]
  ).length;
  const answeredAndMarked = Object.keys(selectedAnswers).filter(
    (qid) => markedForReview[qid]
  ).length;

  // Show loading state
  if (isLoading || !currentAttempt || !currentQuiz) {
    return <LoadingScreen message="Loading quiz..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #E0E0E0',
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: '#E0E0E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#757575' }}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    Candidate Name: <strong>{user?.username || '[Your Name]'}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    Exam Name: <strong>{currentQuiz.title}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    Subject Name: <strong>{currentQuiz.category}</strong>
                  </Typography>
                  {timeRemaining && (
                    <Typography variant="body2" sx={{ color: '#757575' }}>
                      Remaining Time:{' '}
                      <Chip
                        label={timeRemaining}
                        size="small"
                        sx={{
                          backgroundColor: '#2196F3',
                          color: '#FFFFFF',
                          fontWeight: 600,
                        }}
                      />
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Grid container spacing={2}>
          {/* Question Area */}
          <Grid item xs={12} lg={8}>
            {/* Scroll Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton
                size="small"
                sx={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: 1,
                  '&:hover': { backgroundColor: '#F5F5F5' },
                }}
              >
                <KeyboardDoubleArrowUpIcon />
              </IconButton>
            </Box>

            {/* Question Card */}
            {currentQuestion && (
              <Paper
                sx={{
                  p: 3,
                  mb: 2,
                  backgroundColor: '#FFFFFF',
                  minHeight: '400px',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#2D3436',
                    mb: 3,
                  }}
                >
                  Question {currentQuestionIndex + 1}:
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    lineHeight: 1.8,
                    color: '#2D3436',
                  }}
                >
                  {currentQuestion.question_text}
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 2,
                    color: '#757575',
                  }}
                >
                  Options:
                </Typography>

                <RadioGroup
                  value={selectedAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                >
                  {currentQuestion.answers?.map((answer, index) => (
                    <FormControlLabel
                      key={answer.id}
                      value={answer.id}
                      control={<Radio />}
                      label={
                        <Typography variant="body1">
                          {index + 1}. {answer.answer_text}
                        </Typography>
                      }
                      sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: 1,
                        border: '1px solid #E0E0E0',
                        '&:hover': {
                          backgroundColor: '#F5F5F5',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </Paper>
            )}

            {/* Scroll Down Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton
                size="small"
                sx={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: 1,
                  '&:hover': { backgroundColor: '#F5F5F5' },
                }}
              >
                <KeyboardDoubleArrowDownIcon />
              </IconButton>
            </Box>

            {/* Action Buttons */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <QuizCraftButton
                    variant="contained"
                    onClick={handleSaveAndNext}
                    sx={{
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#45A049' },
                    }}
                  >
                    Save & Next
                  </QuizCraftButton>

                  <QuizCraftButton
                    variant="contained"
                    onClick={handleClear}
                    sx={{
                      backgroundColor: '#9E9E9E',
                      '&:hover': { backgroundColor: '#757575' },
                    }}
                  >
                    Clear
                  </QuizCraftButton>

                  <QuizCraftButton
                    variant="contained"
                    onClick={handleSaveAndMarkForReview}
                    sx={{
                      backgroundColor: '#FF9800',
                      '&:hover': { backgroundColor: '#F57C00' },
                    }}
                  >
                    Save & Mark for Review
                  </QuizCraftButton>

                  <QuizCraftButton
                    variant="contained"
                    onClick={handleMarkForReviewAndNext}
                    sx={{
                      backgroundColor: '#2196F3',
                      '&:hover': { backgroundColor: '#1976D2' },
                    }}
                  >
                    Mark for Review & Next
                  </QuizCraftButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <QuizCraftButton
                    variant="outlined"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    startIcon={<span>&lt;&lt;</span>}
                  >
                    Back
                  </QuizCraftButton>

                  <QuizCraftButton
                    variant="outlined"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    endIcon={<span>&gt;&gt;</span>}
                  >
                    Next
                  </QuizCraftButton>

                  <QuizCraftButton
                    variant="contained"
                    onClick={handleSubmitClick}
                    sx={{
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#45A049' },
                    }}
                  >
                    Submit
                  </QuizCraftButton>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Desktop Question Palette */}
          {isDesktop && (
            <Grid item lg={4}>
              <Paper
                sx={{
                  position: 'sticky',
                  top: 20,
                  p: 2,
                  backgroundColor: '#FFFFFF',
                  maxHeight: 'calc(100vh - 40px)',
                  overflowY: 'auto',
                }}
              >
              {/* Status Legend */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '4px',
                      backgroundColor: '#B0BEC5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                    }}
                  >
                    {notVisited}
                  </Box>
                  <Typography variant="caption">Not Visited</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '4px',
                      backgroundColor: '#FF5722',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                    }}
                  >
                    {notAnswered}
                  </Box>
                  <Typography variant="caption">Not Answered</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '4px',
                      backgroundColor: '#4CAF50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                    }}
                  >
                    {answered}
                  </Box>
                  <Typography variant="caption">Answered</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '4px',
                      backgroundColor: '#9C27B0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                    }}
                  >
                    {markedCount}
                  </Box>
                  <Typography variant="caption">Marked for Review</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: '#9C27B0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                    }}
                  >
                    {answeredAndMarked}
                  </Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    Answered & Marked for Review (will be considered for evaluation)
                  </Typography>
                </Box>
              </Box>

              {/* Question Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 1,
                }}
              >
                {currentQuiz.questions?.map((question, index) => {
                  const status = getQuestionStatus(question);
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <Box
                      key={question.id}
                      onClick={() => handleQuestionClick(index)}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: status === 'answered-marked' ? '50%' : '4px',
                        backgroundColor: getStatusColor(status),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: isCurrent ? '3px solid #000' : 'none',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
          )}
        </Grid>
      </Container>

      {/* Mobile Floating Action Button */}
      {!isDesktop && (
        <Fab
          onClick={() => setPaletteCollapsed(!paletteCollapsed)}
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 80,
            backgroundColor: '#2196F3',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#1976D2',
            },
          }}
        >
          ☰
        </Fab>
      )}

      {/* Mobile Drawer for Question Palette */}
      {!isDesktop && (
        <Drawer
          anchor="right"
          open={!paletteCollapsed}
          onClose={() => setPaletteCollapsed(true)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              maxWidth: 400,
            },
          }}
        >
        <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
          {/* Mobile Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              pb: 2,
              borderBottom: '1px solid #E0E0E0',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Question Palette
            </Typography>
            <IconButton size="small" onClick={() => setPaletteCollapsed(true)}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>

          {/* Status Legend */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '4px',
                  backgroundColor: '#B0BEC5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                {notVisited}
              </Box>
              <Typography variant="caption">Not Visited</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '4px',
                  backgroundColor: '#FF5722',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                {notAnswered}
              </Box>
              <Typography variant="caption">Not Answered</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '4px',
                  backgroundColor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                {answered}
              </Box>
              <Typography variant="caption">Answered</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '4px',
                  backgroundColor: '#9C27B0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                {markedCount}
              </Box>
              <Typography variant="caption">Marked for Review</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: '#9C27B0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                {answeredAndMarked}
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                Answered & Marked for Review (will be considered for evaluation)
              </Typography>
            </Box>
          </Box>

          {/* Question Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 1,
            }}
          >
            {currentQuiz.questions?.map((question, index) => {
              const status = getQuestionStatus(question);
              const isCurrent = index === currentQuestionIndex;

              return (
                <Box
                  key={question.id}
                  onClick={() => {
                    handleQuestionClick(index);
                    setPaletteCollapsed(true);
                  }}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: status === 'answered-marked' ? '50%' : '4px',
                    backgroundColor: getStatusColor(status),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isCurrent ? '3px solid #000' : 'none',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Drawer>
      )}

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the quiz? Once submitted, you cannot change your answers.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Total Questions:</strong> {totalQuestions}
            </Typography>
            <Typography variant="body2">
              <strong>Answered:</strong> {answered + answeredAndMarked}
            </Typography>
            <Typography variant="body2">
              <strong>Not Answered:</strong> {totalQuestions - answered - answeredAndMarked}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <QuizCraftButton
            onClick={() => setSubmitDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            onClick={handleFinishQuiz}
            variant="contained"
            loading={isFinishing}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45A049' },
            }}
          >
            Yes, Submit
          </QuizCraftButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TakeQuizScreen;
