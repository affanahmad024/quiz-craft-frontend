// Quiz Instructions Screen
// Display instructions before starting the quiz
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { toast } from 'react-hot-toast';

function QuizInstructionsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, isLoading, getQuiz } = useQuiz();
  const { startAttempt } = useAttempt();

  const [agreedToInstructions, setAgreedToInstructions] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Fetch quiz on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await getQuiz(id, true);
      if (!response.success) {
        toast.error(response.error || 'Failed to load quiz');
        navigate(ROUTES.QUIZ_LIST);
      }
    };
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle back to quiz detail
  const handleBack = () => {
    navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id }));
  };

  // Handle proceed to quiz
  const handleProceed = async () => {
    if (!agreedToInstructions) {
      toast.error('Please read and agree to the instructions');
      return;
    }

    setIsStarting(true);
    const response = await startAttempt(id);
    setIsStarting(false);

    if (response.success) {
      const attemptId = response.data?.data?.id || response.data?.id;
      toast.success('Quiz started!');
      navigate(buildRoute(ROUTES.QUIZ_TAKE, { id, attemptId }));
    } else {
      toast.error(response.error || 'Failed to start quiz');
    }
  };

  if (isLoading || !currentQuiz) {
    return <LoadingScreen message="Loading quiz instructions..." />;
  }

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
            {currentQuiz.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#636E72',
            }}
          >
            Please read the instructions carefully before starting
          </Typography>
        </Box>

        {/* Instructions Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#2D3436',
                mb: 3,
              }}
            >
              Please read the instructions carefully
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* General Instructions */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#2D3436',
                mb: 2,
              }}
            >
              General Instructions:
            </Typography>

            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemText
                  primary={`Total duration of ${currentQuiz.title} is ${currentQuiz.time_limit_minutes || 'unlimited'} ${currentQuiz.time_limit_minutes ? 'minutes' : ''}.`}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination." />
              </ListItem>
              <ListItem>
                <ListItemText primary="The Questions Palette displayed on the right side of screen will show the status of each question using one of the following symbols:" />
              </ListItem>
            </List>

            <Box sx={{ ml: 4, mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Not Visited:</strong> You have not visited the question yet.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Not Answered:</strong> You have not answered the question.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Answered:</strong> You have answered the question.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Marked for Review:</strong> You have NOT answered the question, but have marked the question for review.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Answered and Marked for Review:</strong> The question(s) "Answered and Marked for Review" will be considered for evaluation.
              </Typography>
            </Box>

            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemText primary='You can click on the ">" arrow which appears to the left of question palette to collapse the question palette thereby maximizing the question window. To view the question palette again, you can click on "<" which appears on the right side of question window.' />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Navigating to a Question */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#2D3436',
                mb: 2,
              }}
            >
              Navigating to a Question:
            </Typography>

            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemText primary="To answer a question, do the following:" />
              </ListItem>
            </List>

            <Box sx={{ ml: 4, mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Click on <strong>Save & Next</strong> to save your answer for the current question and then go to the next question.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Click on <strong>Mark for Review & Next</strong> to save your answer for the current question, mark it for review, and then go to the next question.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Answering a Question */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#2D3436',
                mb: 2,
              }}
            >
              Answering a Question:
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Procedure for answering a multiple choice type question:
            </Typography>

            <Box sx={{ ml: 4, mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • To select your answer, click on the button of one of the options.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • To deselect your chosen answer, click on the button of the chosen option again or click on the <strong>Clear Response</strong> button.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • To change your chosen answer, click on the button of another option.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • To save your answer, you MUST click on the <strong>Save & Next</strong> button.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • To mark the question for review, click on the <strong>Mark for Review & Next</strong> button.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Quiz Details */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#2D3436',
                mb: 2,
              }}
            >
              Quiz Details:
            </Typography>

            <Box sx={{ ml: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Total Questions:</strong> {currentQuiz.question_count || 0}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Time Limit:</strong> {currentQuiz.time_limit_minutes ? `${currentQuiz.time_limit_minutes} minutes` : 'No time limit'}
              </Typography>
              {currentQuiz.passing_score && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Passing Score:</strong> {currentQuiz.passing_score}%
                </Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Difficulty:</strong> {currentQuiz.difficulty}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Agreement Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreedToInstructions}
                  onChange={(e) => setAgreedToInstructions(e.target.checked)}
                  sx={{
                    color: '#667eea',
                    '&.Mui-checked': {
                      color: '#667eea',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#2D3436' }}>
                  I have read and understood the instructions. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. / any prohibited material with me. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations.
                </Typography>
              }
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <QuizCraftButton
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5568d3',
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
              },
            }}
          >
            Back to Quiz
          </QuizCraftButton>

          <QuizCraftButton
            variant="contained"
            size="large"
            endIcon={<PlayArrowIcon />}
            onClick={handleProceed}
            disabled={!agreedToInstructions}
            loading={isStarting}
            sx={{
              background: !agreedToInstructions
                ? '#9E9E9E'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              px: 4,
              '&:hover': {
                background: !agreedToInstructions
                  ? '#9E9E9E'
                  : 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
              },
            }}
          >
            Proceed to Quiz
          </QuizCraftButton>
        </Box>
      </Container>
    </Box>
  );
}

export default QuizInstructionsScreen;
