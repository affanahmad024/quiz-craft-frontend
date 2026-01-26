// Interactive Demo Quiz Component
// Playable demo quiz on landing page
// Modern & elegant animations with Framer Motion

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
  ArrowForward as ArrowForwardIcon,
  Replay as ReplayIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/RouteConstants';
import { useThemeMode } from '../../contexts/theme/ThemeModeContext';

// Demo quiz data - General Knowledge
const DEMO_QUESTIONS = [
  {
    id: 1,
    type: 'mcq',
    question: 'What is the largest planet in our solar system?',
    options: ['Mars', 'Jupiter', 'Saturn', 'Neptune'],
    correctAnswer: 1, // Jupiter
    explanation: 'Jupiter is the largest planet in our solar system, with a mass more than twice that of all other planets combined.',
  },
  {
    id: 2,
    type: 'boolean',
    question: 'The Great Wall of China is visible from space with the naked eye.',
    options: ['True', 'False'],
    correctAnswer: 1, // False
    explanation: 'This is a common myth. The Great Wall is not visible from space with the naked eye. It\'s too narrow and blends with the natural landscape.',
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which element has the chemical symbol "Au"?',
    options: ['Silver', 'Gold', 'Aluminum', 'Argon'],
    correctAnswer: 1, // Gold
    explanation: 'Au comes from the Latin word "aurum" meaning gold. It\'s one of the most valuable precious metals.',
  },
];

// Animation variants
const questionVariants = {
  enter: { opacity: 0, x: 50, scale: 0.95 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.95 },
};

const resultVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  }),
};

function InteractiveDemoQuiz() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeMode();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const progress = ((currentQuestion + 1) / DEMO_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestion === DEMO_QUESTIONS.length - 1;

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    setAnswers({
      ...answers,
      [currentQuestion]: selectedAnswer,
    });

    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSelectedAnswer(null);
    setShowSignupModal(false);
  };

  const calculateScore = () => {
    let correct = 0;
    DEMO_QUESTIONS.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const currentQuestionData = DEMO_QUESTIONS[currentQuestion];
  const score = calculateScore();
  const percentage = Math.round((score / DEMO_QUESTIONS.length) * 100);

  // Results View
  if (showResults) {
    return (
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: isDarkMode
            ? 'linear-gradient(180deg, rgba(108, 92, 231, 0.05) 0%, rgba(0, 0, 0, 0) 100%)'
            : 'linear-gradient(180deg, rgba(108, 92, 231, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Results Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `conic-gradient(#6C5CE7 ${percentage}%, ${
                      isDarkMode ? '#2d3436' : '#dfe6e9'
                    } 0)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 8,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {percentage}%
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Quiz Complete! 🎉
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You scored {score} out of {DEMO_QUESTIONS.length}
              </Typography>
            </Box>

            {/* Results Breakdown */}
            <Stack spacing={3} sx={{ mb: 4 }}>
              {DEMO_QUESTIONS.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <motion.div
                    key={q.id}
                    custom={index}
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card
                      elevation={0}
                      sx={{
                        border: '1px solid',
                        borderColor: isCorrect ? 'success.main' : 'error.main',
                        bgcolor: isCorrect
                          ? alpha(theme.palette.success.main, 0.05)
                          : alpha(theme.palette.error.main, 0.05),
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          {isCorrect ? (
                            <CheckIcon sx={{ color: 'success.main', fontSize: 28 }} />
                          ) : (
                            <WrongIcon sx={{ color: 'error.main', fontSize: 28 }} />
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Question {index + 1}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                              {q.question}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Your answer:{' '}
                                <span style={{ color: isCorrect ? theme.palette.success.main : theme.palette.error.main }}>
                                  {q.options[userAnswer]}
                                </span>
                              </Typography>
                              {!isCorrect && (
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                  Correct answer: {q.options[q.correctAnswer]}
                                </Typography>
                              )}
                            </Box>

                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">
                                <strong>Explanation:</strong> {q.explanation}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </Stack>

            {/* CTA Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowSignupModal(true)}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
                  fontWeight: 700,
                  boxShadow: '0 10px 30px rgba(108, 92, 231, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 40px rgba(108, 92, 231, 0.4)',
                  },
                }}
              >
                Create Your Own Quiz
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleRestart}
                startIcon={<ReplayIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  borderWidth: 2,
                  fontWeight: 700,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                Try Again
              </Button>
            </Stack>
          </motion.div>
        </Container>

        {/* Signup Modal */}
        <Dialog
          open={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: isDarkMode
                ? 'linear-gradient(135deg, #2d3436 0%, #1e1e1e 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            },
          }}
        >
          <DialogContent sx={{ p: 4, textAlign: 'center' }}>
            <TrophyIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Create Your Own?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Sign up now to create unlimited quizzes with AI, track your progress, and compete with friends!
            </Typography>
            <Stack direction="column" spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(ROUTES.SIGNUP)}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
                  fontWeight: 700,
                }}
              >
                Sign Up Free
              </Button>
              <Button variant="text" onClick={() => setShowSignupModal(false)}>
                Maybe Later
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }

  // Quiz View
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: isDarkMode
          ? 'radial-gradient(circle at 50% 0%, rgba(108, 92, 231, 0.1), transparent 50%)'
          : 'radial-gradient(circle at 50% 0%, rgba(108, 92, 231, 0.05), transparent 50%)',
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            label="🎮 Interactive Demo"
            sx={{
              mb: 2,
              px: 2,
              py: 0.5,
              fontWeight: 700,
              bgcolor: 'primary.main',
              color: 'white',
              fontSize: '0.875rem',
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Try It Yourself
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Experience QuizCraft in action - no signup required
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Question {currentQuestion + 1} of {DEMO_QUESTIONS.length}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #6C5CE7 0%, #a29bfe 100%)',
              },
            }}
          />
        </Box>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            variants={questionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                transform: 'translateZ(0)',
                perspective: 1000,
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Chip
                  label={currentQuestionData.type === 'mcq' ? 'Multiple Choice' : 'True/False'}
                  size="small"
                  color="primary"
                  sx={{ mb: 3, fontWeight: 600 }}
                />

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    lineHeight: 1.4,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  {currentQuestionData.question}
                </Typography>

                <RadioGroup value={selectedAnswer} onChange={(e) => handleAnswerSelect(Number(e.target.value))}>
                  <Stack spacing={2}>
                    {currentQuestionData.options.map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: '2px solid',
                            borderColor: selectedAnswer === index ? 'primary.main' : 'divider',
                            bgcolor:
                              selectedAnswer === index
                                ? alpha(theme.palette.primary.main, 0.08)
                                : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: selectedAnswer === index ? 'primary.main' : 'text.disabled',
                              bgcolor:
                                selectedAnswer === index
                                  ? alpha(theme.palette.primary.main, 0.12)
                                  : alpha(theme.palette.action.hover, 0.5),
                            },
                          }}
                          onClick={() => handleAnswerSelect(index)}
                        >
                          <FormControlLabel
                            value={index}
                            control={
                              <Radio
                                sx={{
                                  '& .MuiSvgIcon-root': {
                                    fontSize: 24,
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ fontWeight: selectedAnswer === index ? 600 : 400 }}>
                                {option}
                              </Typography>
                            }
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Box>
                      </motion.div>
                    ))}
                  </Stack>
                </RadioGroup>
              </CardContent>

              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
                    boxShadow: '0 10px 20px rgba(108, 92, 231, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 30px rgba(108, 92, 231, 0.4)',
                    },
                    '&:disabled': {
                      background: 'grey.300',
                      color: 'text.disabled',
                    },
                  }}
                >
                  {isLastQuestion ? 'See Results' : 'Next Question'}
                </Button>
              </Box>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
}

export default InteractiveDemoQuiz;
