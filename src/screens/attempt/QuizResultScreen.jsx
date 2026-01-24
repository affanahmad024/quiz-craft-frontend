// Quiz Result Screen
// Display detailed quiz attempt results
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Grid,
  LinearProgress,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
  ArrowBack as ArrowBackIcon,
  Replay as ReplayIcon,
  TrendingUp as TrendingUpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { toast } from 'react-hot-toast';

function QuizResultScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResults, isLoading, getAttemptResults } = useAttempt();
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Fetch results on mount - always fetch fresh data
  useEffect(() => {
    const fetchResults = async () => {
      console.log('[QuizResultScreen] Fetching results for attempt:', id);
      const response = await getAttemptResults(id);

      console.log('[QuizResultScreen] Results response:', {
        success: response.success,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : []
      });

      if (!response.success) {
        console.error('[QuizResultScreen] Failed to fetch results:', response.error);
        toast.error(response.error || 'Failed to load results');
        navigate(ROUTES.ATTEMPT_LIST);
      }
    };

    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle back to attempts
  const handleBackToAttempts = () => {
    navigate(ROUTES.ATTEMPT_LIST);
  };

  // Validate that results have required data
  const hasValidResults = currentResults &&
    currentResults.id &&
    typeof currentResults.score !== 'undefined' &&
    typeof currentResults.max_score !== 'undefined';

  console.log('[QuizResultScreen] Render state:', {
    isLoading,
    hasCurrentResults: !!currentResults,
    hasValidResults,
    currentResultsId: currentResults?.id,
    score: currentResults?.score,
    maxScore: currentResults?.max_score
  });

  if (isLoading || !currentResults || !hasValidResults) {
    console.log('[QuizResultScreen] Showing loading screen');
    return <LoadingScreen message="Loading results..." />;
  }

  // The API returns a flat structure with all data at the top level
  // Extract the data we need
  const attempt = currentResults;
  const quiz = currentResults;
  const answers = currentResults.answers || [];

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    if (attempt?.quiz_id) {
      navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id: attempt.quiz_id }));
    }
  };

  // Calculate time taken
  const calculateTimeTaken = () => {
    if (!attempt?.started_at || !attempt?.submitted_at) {
      return 'N/A';
    }

    const start = new Date(attempt.started_at);
    const end = new Date(attempt.submitted_at);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    return `${diffMins}m ${diffSecs}s`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Toggle question expansion
  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Calculate stats
  const calculateStats = () => {
    const totalQuestions = currentResults.total_questions || 0;
    const answeredQuestions = currentResults.answered_count || 0;
    const correctAnswers = answers.filter((a) => a.is_correct).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const unansweredQuestions = totalQuestions - answeredQuestions;

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
    };
  };

  const stats = calculateStats();
  const passed = attempt?.passed;
  const percentage = attempt?.percentage || 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#2D3436',
              mb: 1,
            }}
          >
            Quiz Results
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#636E72',
            }}
          >
            {quiz?.title || 'Quiz Results'}
          </Typography>
        </Box>

        {/* Result Summary Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            background: passed
              ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              : 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              {/* Score Display */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        color: '#FFFFFF',
                      }}
                    >
                      {percentage.toFixed(0)}%
                    </Typography>
                  </Box>

                  <Chip
                    label={passed ? 'PASSED' : 'FAILED'}
                    icon={passed ? <CheckCircleIcon /> : <CancelIcon />}
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      py: 3,
                      px: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: passed ? '#43e97b' : '#f5576c',
                    }}
                  />
                </Box>
              </Grid>

              {/* Score Breakdown */}
              <Grid item xs={12} md={6}>
                <Box sx={{ color: '#FFFFFF' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Score Breakdown
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1">Your Score</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {attempt?.score || 0} / {attempt?.max_score || 100} points
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#FFFFFF',
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Passing Score Required</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {quiz?.passing_score || 0}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Total Questions */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid #E8E8E8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <QuestionAnswerIcon sx={{ color: '#667eea', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalQuestions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Questions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Correct Answers */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid #E8E8E8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(67, 233, 123, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckIcon sx={{ color: '#43e97b', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#43e97b' }}>
                      {stats.correctAnswers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Correct
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Incorrect Answers */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid #E8E8E8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 87, 108, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CloseIcon sx={{ color: '#f5576c', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f5576c' }}>
                      {stats.incorrectAnswers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Incorrect
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Time Taken */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid #E8E8E8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccessTimeIcon sx={{ color: '#FF9800', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {calculateTimeTaken()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time Taken
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attempt Details */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#2D3436',
                mb: 3,
              }}
            >
              Attempt Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarTodayIcon sx={{ color: '#636E72', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Started At
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatDate(attempt?.started_at)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarTodayIcon sx={{ color: '#636E72', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Submitted At
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatDate(attempt?.submitted_at)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <EmojiEventsIcon sx={{ color: '#636E72', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      <Chip
                        label={attempt?.status || 'N/A'}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                          fontWeight: 600,
                        }}
                      />
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpIcon sx={{ color: '#636E72', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Difficulty
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {quiz?.difficulty || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <QuizCraftButton
            variant="outlined"
            onClick={handleBackToAttempts}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5568d3',
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
              },
            }}
          >
            Back to Attempts
          </QuizCraftButton>
          <QuizCraftButton
            variant="contained"
            onClick={handleRetakeQuiz}
            startIcon={<ReplayIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
              },
            }}
          >
            Retake Quiz
          </QuizCraftButton>
        </Box>

        {/* Questions Review Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#2D3436',
              mb: 3,
            }}
          >
            Review Answers ({answers?.length || 0} Questions)
          </Typography>
        </Box>

        {/* Questions List */}
        {answers && answers.length > 0 ? (
          <Stack spacing={2}>
            {answers.map((answer, index) => {
              const isCorrect = answer.is_correct;
              const isExpanded = expandedQuestions[answer.question_id];

              return (
                <Card
                  key={answer.id}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #E8E8E8',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Question Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleQuestion(answer.question_id)}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={`Question ${index + 1}`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            label={isCorrect ? 'Correct' : 'Incorrect'}
                            size="small"
                            icon={isCorrect ? <CheckIcon /> : <CloseIcon />}
                            sx={{
                              backgroundColor: isCorrect
                                ? 'rgba(67, 233, 123, 0.1)'
                                : 'rgba(245, 87, 108, 0.1)',
                              color: isCorrect ? '#43e97b' : '#f5576c',
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            label={`${answer.points_earned || 0} pts`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 152, 0, 0.1)',
                              color: '#FF9800',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: '#2D3436',
                          }}
                        >
                          {answer.question_text}
                        </Typography>
                      </Box>

                      <IconButton size="small">
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>

                    {/* Question Details (Collapsible) */}
                    <Collapse in={isExpanded}>
                      <Divider sx={{ my: 2 }} />

                      {/* Answer Details */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 2,
                            color: '#636E72',
                            fontWeight: 600,
                          }}
                        >
                          Your Answer:
                        </Typography>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: isCorrect ? '#43e97b' : '#f5576c',
                            backgroundColor: isCorrect
                              ? 'rgba(67, 233, 123, 0.05)'
                              : 'rgba(245, 87, 108, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              flex: 1,
                            }}
                          >
                            {answer.selected_answer_text}
                          </Typography>
                          <Chip
                            label={isCorrect ? 'Correct' : 'Incorrect'}
                            size="small"
                            icon={isCorrect ? <CheckIcon /> : <CloseIcon />}
                            sx={{
                              backgroundColor: isCorrect ? '#43e97b' : '#f5576c',
                              color: '#FFFFFF',
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        {!isCorrect && answer.correct_answer_text && (
                          <>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                mb: 2,
                                color: '#636E72',
                                fontWeight: 600,
                              }}
                            >
                              Correct Answer:
                            </Typography>
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '2px solid #43e97b',
                                backgroundColor: 'rgba(67, 233, 123, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  flex: 1,
                                }}
                              >
                                {answer.correct_answer_text}
                              </Typography>
                              <Chip
                                label="Correct Answer"
                                size="small"
                                icon={<CheckIcon />}
                                sx={{
                                  backgroundColor: '#43e97b',
                                  color: '#FFFFFF',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          </>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid #E8E8E8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <QuestionAnswerIcon
                sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No questions to display
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

export default QuizResultScreen;
