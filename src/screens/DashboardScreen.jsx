// Dashboard Screen - Modern Design
// Main dashboard for authenticated users with real statistics
// Following Phoenix pattern with modern card-based layout

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Skeleton,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import { ROUTES } from '../constants/RouteConstants';
import {
  Quiz as QuizIcon,
  Add as AddIcon,
  Explore as ExploreIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import SetBrowserTabTitle from '../layout/SetBrowserTabTitle';
import toast from 'react-hot-toast';
import CreateQuizModal from '../components/modals/CreateQuizModal';

/**
 * Modern Dashboard Screen with real statistics
 */
function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // Simulating API calls for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual API calls
      setStats({
        quizzesCreated: 12,
        quizzesTaken: 45,
        averageScore: 78.5,
        totalPoints: 3525,
        passingRate: 84.4,
        currentStreak: 5,
      });

      setRecentQuizzes([
        {
          id: '1',
          title: 'JavaScript Fundamentals',
          difficulty: 'Medium',
          questionCount: 20,
          createdAt: '2 days ago',
        },
        {
          id: '2',
          title: 'React Hooks Deep Dive',
          difficulty: 'Hard',
          questionCount: 15,
          createdAt: '5 days ago',
        },
      ]);

      setRecentAttempts([
        {
          id: '1',
          quizTitle: 'Python Basics',
          score: 85,
          maxScore: 100,
          passed: true,
          completedAt: '1 hour ago',
        },
        {
          id: '2',
          quizTitle: 'Data Structures',
          score: 72,
          maxScore: 100,
          passed: true,
          completedAt: '3 hours ago',
        },
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'success',
      Medium: 'warning',
      Hard: 'error',
    };
    return colors[difficulty] || 'default';
  };

  return (
    <>
      <SetBrowserTabTitle title="Dashboard" />
      <Box
        sx={{
          minHeight: 'calc(100vh - 72px)',
          backgroundColor: '#F8F9FA',
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          {/* Welcome Section */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Welcome back, {user?.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Ready to continue your learning journey?
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={fetchDashboardData}
                  disabled={loading}
                  sx={{
                    backgroundColor: 'white',
                    boxShadow: 1,
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {/* Quick Action Buttons */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setCreateModalOpen(true)}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
                    boxShadow: 4,
                  },
                }}
              >
                Create Quiz
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<QuizIcon />}
                onClick={() => navigate(ROUTES.QUIZ_LIST)}
                sx={{ py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
                My Quizzes
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<ExploreIcon />}
                onClick={() => navigate(ROUTES.DISCOVER)}
                sx={{ py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
                Discover
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<TimeIcon />}
                onClick={() => navigate(ROUTES.ATTEMPT_LIST)}
                sx={{ py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
                My Attempts
              </Button>
            </Grid>
          </Grid>

          {/* Statistics Cards */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Your Statistics
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Quizzes Created */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  {loading ? (
                    <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <QuizIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats?.quizzesCreated || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Quizzes Created
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Quizzes Taken */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  {loading ? (
                    <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats?.quizzesTaken || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Quizzes Taken
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Average Score */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  {loading ? (
                    <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrendingUpIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats?.averageScore || 0}%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Average Score
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Total Points */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  {loading ? (
                    <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrophyIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats?.totalPoints || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Points
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Passing Rate */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  {loading ? (
                    <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats?.passingRate || 0}%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Passing Rate
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Current Streak */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  {loading ? (
                    <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrophyIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats?.currentStreak || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Day Streak 🔥
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity Section */}
          <Grid container spacing={3}>
            {/* Recent Quizzes */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Quizzes
                    </Typography>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(ROUTES.QUIZ_LIST)}
                      size="small"
                    >
                      View All
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {loading ? (
                    <>
                      <Skeleton variant="rectangular" height={80} sx={{ mb: 1.5, borderRadius: 1 }} />
                      <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
                    </>
                  ) : recentQuizzes.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {recentQuizzes.map((quiz) => (
                        <Paper
                          key={quiz.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: 2,
                              borderColor: 'primary.main',
                            },
                          }}
                          onClick={() => navigate(`/quizzes/${quiz.id}`)}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {quiz.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={quiz.difficulty}
                              size="small"
                              color={getDifficultyColor(quiz.difficulty)}
                              sx={{ fontSize: '0.7rem' }}
                            />
                            <Chip
                              label={`${quiz.questionCount} questions`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', alignSelf: 'center' }}>
                              {quiz.createdAt}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <QuizIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No quizzes yet. Create your first quiz!
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateModalOpen(true)}
                        sx={{ mt: 2 }}
                      >
                        Create Quiz
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Attempts */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Attempts
                    </Typography>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(ROUTES.ATTEMPT_LIST)}
                      size="small"
                    >
                      View All
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {loading ? (
                    <>
                      <Skeleton variant="rectangular" height={80} sx={{ mb: 1.5, borderRadius: 1 }} />
                      <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
                    </>
                  ) : recentAttempts.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {recentAttempts.map((attempt) => (
                        <Paper
                          key={attempt.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: 2,
                              borderColor: 'primary.main',
                            },
                          }}
                          onClick={() => navigate(`/attempts/${attempt.id}/results`)}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            {attempt.quizTitle}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Score
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  {attempt.score}/{attempt.maxScore}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(attempt.score / attempt.maxScore) * 100}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: 'rgba(0,0,0,0.05)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: attempt.passed ? '#43e97b' : '#f5576c',
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {attempt.completedAt}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <ExploreIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No attempts yet. Start taking quizzes!
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<ExploreIcon />}
                        onClick={() => navigate(ROUTES.DISCOVER)}
                        sx={{ mt: 2 }}
                      >
                        Discover Quizzes
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Create Quiz Modal */}
      <CreateQuizModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}

export default DashboardScreen;
