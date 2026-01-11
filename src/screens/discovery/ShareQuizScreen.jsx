// Share Quiz Screen
// Access quiz via share code
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import { useDiscovery } from '../../contexts/discovery/DiscoveryContextProvider';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../../constants/QuizConstants';
import LoadingScreen from '../../components/screens/LoadingScreen';
import toast from 'react-hot-toast';

/**
 * Share Quiz Screen
 * Access quiz via share code
 */
function ShareQuizScreen() {
  const navigate = useNavigate();
  const { code } = useParams();
  const { getQuizByShareCode, isLoading } = useDiscovery();
  const { startAttempt } = useAttempt();

  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [code]);

  const loadQuiz = async () => {
    const response = await getQuizByShareCode(code);

    if (response.success) {
      setQuiz(response.data);
      setError(false);
    } else {
      setError(true);
      toast.error('Invalid or expired share code');
    }
  };

  const handleStartQuiz = async () => {
    const response = await startAttempt(quiz.id);
    if (response.success) {
      navigate(buildRoute(ROUTES.QUIZ_START, { id: quiz.id }));
    }
  };

  const handleViewDetails = () => {
    navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id: quiz.id }));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <ShareIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Invalid Share Code
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                This share code is invalid or has expired
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(ROUTES.DISCOVER)}
                sx={{
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                }}
              >
                Discover Quizzes
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <ShareIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {quiz.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {quiz.description}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={quiz.category} color="primary" />
                <Chip
                  label={DIFFICULTY_LABELS[quiz.difficulty]}
                  color={DIFFICULTY_COLORS[quiz.difficulty]}
                />
                {quiz.is_public && <Chip label="Public" color="success" variant="outlined" />}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quiz Information
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Questions
                  </Typography>
                  <Typography variant="h6">{quiz.question_count || 0}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Time Limit
                  </Typography>
                  <Typography variant="h6">
                    {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : 'No limit'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Passing Score
                  </Typography>
                  <Typography variant="h6">{quiz.passing_score}%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Attempts
                  </Typography>
                  <Typography variant="h6">{quiz.attempt_count || 0}</Typography>
                </Box>
              </Box>

              {quiz.tags && quiz.tags.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {quiz.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleStartQuiz}
                sx={{
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                  px: 4,
                }}
              >
                Start Quiz
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<InfoIcon />}
                onClick={handleViewDetails}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ShareQuizScreen;
