// Quiz Result Screen
// Display detailed quiz attempt results
// Following Phoenix pattern

import { useEffect } from 'react';
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
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
  ArrowBack as ArrowBackIcon,
  Replay as ReplayIcon,
} from '@mui/icons-material';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import { COLORS } from '../../constants/ColorConstants';
import AnswerOption from '../../components/attempt/AnswerOption';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { toast } from 'react-hot-toast';

function QuizResultScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResults, isLoading, getAttemptResults } = useAttempt();

  // Fetch results on mount
  useEffect(() => {
    const fetchResults = async () => {
      const response = await getAttemptResults(id);
      if (!response.success) {
        toast.error(response.error || 'Failed to load results');
        navigate(ROUTES.ATTEMPT_LIST);
      }
    };

    fetchResults();
  }, [id, getAttemptResults, navigate]);

  // Handle back to attempts
  const handleBackToAttempts = () => {
    navigate(ROUTES.ATTEMPT_LIST);
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    if (currentResults?.quiz_id) {
      navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id: currentResults.quiz_id }));
    }
  };

  // Calculate time taken
  const calculateTimeTaken = () => {
    if (!currentResults?.started_at || !currentResults?.submitted_at) {
      return 'N/A';
    }

    const start = new Date(currentResults.started_at);
    const end = new Date(currentResults.submitted_at);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    return `${diffMins}m ${diffSecs}s`;
  };

  if (isLoading || !currentResults) {
    return <LoadingScreen message="Loading results..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Quiz Results
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {currentResults.quiz_title}
          </Typography>
        </Box>

        {/* Summary Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Score Display */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: COLORS.PRIMARY,
                  mb: 1,
                }}
              >
                {currentResults.score} / {currentResults.max_score || 100}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: COLORS.TEXT_SECONDARY,
                  mb: 2,
                }}
              >
                {currentResults.percentage?.toFixed(1)}%
              </Typography>

              {/* Pass/Fail Badge */}
              {currentResults.passed !== null && (
                <Chip
                  label={currentResults.passed ? 'PASSED' : 'FAILED'}
                  icon={
                    currentResults.passed ? (
                      <CheckCircleIcon />
                    ) : (
                      <CancelIcon />
                    )
                  }
                  color={currentResults.passed ? 'success' : 'error'}
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    py: 3,
                    px: 2,
                  }}
                />
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Stats Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ color: COLORS.INFO }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {calculateTimeTaken()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Time Taken
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEventsIcon sx={{ color: COLORS.WARNING }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {currentResults.passing_score || 'N/A'}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Passing Score
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 3,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <QuizCraftButton
                variant="outlined"
                onClick={handleBackToAttempts}
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderColor: COLORS.PRIMARY,
                  color: COLORS.PRIMARY,
                }}
              >
                Back to Attempts
              </QuizCraftButton>
              <QuizCraftButton
                variant="contained"
                onClick={handleRetakeQuiz}
                startIcon={<ReplayIcon />}
                sx={{
                  background:
                    'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)',
                  },
                }}
              >
                Retake Quiz
              </QuizCraftButton>
            </Box>
          </CardContent>
        </Card>

        {/* Quiz Info */}
        {currentResults.quiz_description && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: COLORS.TEXT_PRIMARY }}
              >
                About this Quiz
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: COLORS.TEXT_SECONDARY, lineHeight: 1.6 }}
              >
                {currentResults.quiz_description}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Questions and Answers Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 600,
              mb: 2,
            }}
          >
            Review Answers
          </Typography>
        </Box>

        {/* Questions List */}
        {currentResults.questions && currentResults.questions.length > 0 ? (
          <Stack spacing={3}>
            {currentResults.questions.map((question, index) => (
              <Card key={question.id}>
                <CardContent sx={{ p: 3 }}>
                  {/* Question Header */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: COLORS.PRIMARY, mb: 1 }}
                    >
                      Question {index + 1}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        color: COLORS.TEXT_PRIMARY,
                        mb: 2,
                      }}
                    >
                      {question.question_text}
                    </Typography>
                  </Box>

                  {/* Answers */}
                  {question.question_type === 'short_answer' ? (
                    // Short Answer Display
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: COLORS.TEXT_SECONDARY,
                          mb: 1,
                          fontWeight: 600,
                        }}
                      >
                        Your Answer:
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: COLORS.LIGHTER_GRAY,
                          borderRadius: 1,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body1">
                          {question.user_answer_text || 'Not answered'}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    // Multiple Choice / True False Display
                    <Stack spacing={2}>
                      {question.answers?.map((answer) => (
                        <AnswerOption
                          key={answer.id}
                          answer={answer}
                          selected={answer.id === question.user_answer_id}
                          onClick={() => {}}
                          showCorrect={true}
                          questionType={question.question_type}
                        />
                      ))}
                    </Stack>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'rgba(108, 92, 231, 0.05)',
                        border: `1px solid ${COLORS.PRIMARY_LIGHT}`,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: COLORS.PRIMARY,
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        Explanation:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: COLORS.TEXT_SECONDARY,
                          lineHeight: 1.6,
                        }}
                      >
                        {question.explanation}
                      </Typography>
                    </Box>
                  )}

                  {/* Points Earned */}
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Chip
                      label={`${question.points_earned || 0} / ${question.points || 1} points`}
                      color={
                        question.points_earned === question.points
                          ? 'success'
                          : 'error'
                      }
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
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
