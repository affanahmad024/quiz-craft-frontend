// Take Quiz Screen
// Interface for taking a quiz attempt
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Stack,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Send as SendIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import { COLORS } from '../../constants/ColorConstants';
import QuizTimer from '../../components/attempt/QuizTimer';
import ProgressIndicator from '../../components/attempt/ProgressIndicator';
import AnswerOption from '../../components/attempt/AnswerOption';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { toast } from 'react-hot-toast';

function TakeQuizScreen() {
  const { id, attemptId } = useParams();
  const navigate = useNavigate();
  const {
    currentAttempt,
    userAnswers,
    isLoading,
    startAttempt,
    getAttempt,
    submitAnswer,
    finishAttempt,
  } = useAttempt();
  const { currentQuiz, getQuiz } = useQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [shortAnswerText, setShortAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Initialize attempt on mount
  useEffect(() => {
    const initializeAttempt = async () => {
      if (!attemptId) {
        // Start new attempt
        const response = await startAttempt(id);
        if (response.success) {
          toast.success('Quiz started!');
        } else {
          toast.error(response.error || 'Failed to start quiz');
          navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id }));
        }
      } else {
        // Load existing attempt
        const response = await getAttempt(attemptId);
        if (!response.success) {
          toast.error(response.error || 'Failed to load attempt');
          navigate(ROUTES.ATTEMPT_LIST);
        }
      }
    };

    initializeAttempt();
  }, [id, attemptId, startAttempt, getAttempt, navigate]);

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
  }, [id, getQuiz]);

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

  // Handle time expiration
  const handleTimeExpire = async () => {
    toast.error('Time expired! Submitting your quiz...');
    await handleFinishQuiz();
  };

  // Handle answer selection
  const handleAnswerSelect = async (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));

    // Auto-save answer
    setIsSubmitting(true);
    const response = await submitAnswer(currentAttempt.id, questionId, answerId, null);
    setIsSubmitting(false);

    if (response.success) {
      toast.success('Answer saved', { duration: 1000 });
    } else {
      toast.error(response.error || 'Failed to save answer');
    }
  };

  // Handle short answer submission
  const handleShortAnswerSubmit = async () => {
    if (!currentQuestion) return;

    const questionId = currentQuestion.id;

    if (!shortAnswerText.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    setIsSubmitting(true);
    const response = await submitAnswer(
      currentAttempt.id,
      questionId,
      null,
      shortAnswerText
    );
    setIsSubmitting(false);

    if (response.success) {
      toast.success('Answer saved');
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: 'answered',
      }));
    } else {
      toast.error(response.error || 'Failed to save answer');
    }
  };

  // Handle navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShortAnswerText('');
    }
  };

  const handleNext = () => {
    if (currentQuestion && currentQuiz.questions.length > currentQuestionIndex + 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShortAnswerText('');
    }
  };

  // Handle finish quiz
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

  // Get current question
  const currentQuestion =
    currentQuiz?.questions?.[currentQuestionIndex] || null;

  // Calculate answered count
  const answeredCount = Object.keys(selectedAnswers).length;

  // Show loading state
  if (isLoading || !currentAttempt || !currentQuiz) {
    return <LoadingScreen message="Loading quiz..." />;
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
        {/* Quiz Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            {currentQuiz.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {currentQuiz.description}
          </Typography>
        </Box>

        {/* Timer and Progress Row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: currentQuiz.time_limit_minutes
              ? { xs: '1fr', md: '2fr 1fr' }
              : '1fr',
            gap: 3,
            mb: 3,
          }}
        >
          {/* Progress Indicator */}
          <ProgressIndicator
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={currentQuiz.questions?.length || 0}
            answeredCount={answeredCount}
          />

          {/* Quiz Timer (if time limit exists) */}
          {currentQuiz.time_limit_minutes && currentAttempt.expires_at && (
            <QuizTimer
              expiresAt={currentAttempt.expires_at}
              onExpire={handleTimeExpire}
            />
          )}
        </Box>

        {/* Question Card */}
        {currentQuestion && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Question Text */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: COLORS.TEXT_PRIMARY,
                  mb: 1,
                }}
              >
                Question {currentQuestionIndex + 1}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  color: COLORS.TEXT_SECONDARY,
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                {currentQuestion.question_text}
              </Typography>

              {/* Answer Options */}
              {currentQuestion.question_type === 'short_answer' ? (
                // Short Answer Input
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Enter your answer here..."
                    value={shortAnswerText}
                    onChange={(e) => setShortAnswerText(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <QuizCraftButton
                    variant="contained"
                    onClick={handleShortAnswerSubmit}
                    loading={isSubmitting}
                    startIcon={<SendIcon />}
                    sx={{
                      background:
                        'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)',
                      },
                    }}
                  >
                    Submit Answer
                  </QuizCraftButton>
                </Box>
              ) : (
                // Multiple Choice / True False
                <Stack spacing={2}>
                  {currentQuestion.answers?.map((answer) => (
                    <AnswerOption
                      key={answer.id}
                      answer={answer}
                      selected={
                        selectedAnswers[currentQuestion.id] === answer.id
                      }
                      onClick={() =>
                        handleAnswerSelect(currentQuestion.id, answer.id)
                      }
                      showCorrect={false}
                      questionType={currentQuestion.question_type}
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <QuizCraftButton
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              startIcon={<NavigateBeforeIcon />}
              sx={{
                bgcolor: 'white',
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  borderColor: COLORS.PRIMARY_DARK,
                },
              }}
            >
              Previous
            </QuizCraftButton>

            <QuizCraftButton
              variant="outlined"
              onClick={handleNext}
              disabled={
                currentQuestionIndex ===
                (currentQuiz.questions?.length || 0) - 1
              }
              endIcon={<NavigateNextIcon />}
              sx={{
                bgcolor: 'white',
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  borderColor: COLORS.PRIMARY_DARK,
                },
              }}
            >
              Next
            </QuizCraftButton>
          </Box>

          <QuizCraftButton
            variant="contained"
            onClick={handleFinishQuiz}
            loading={isFinishing}
            startIcon={<CheckIcon />}
            sx={{
              bgcolor: COLORS.SUCCESS,
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                bgcolor: COLORS.SECONDARY_DARK,
              },
            }}
          >
            Finish Quiz
          </QuizCraftButton>
        </Box>
      </Container>
    </Box>
  );
}

export default TakeQuizScreen;
