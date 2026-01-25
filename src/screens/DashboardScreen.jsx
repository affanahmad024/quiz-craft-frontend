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
  useTheme,
  Alert,
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
  Fireplace as FireIcon,
  SignalCellularAlt as StatsIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import SetBrowserTabTitle from '../layout/SetBrowserTabTitle';
import toast from 'react-hot-toast';
import CreateQuizModal from '../components/modals/CreateQuizModal';
import { getUserStatistics } from '../services/profile/ProfileServices';
import { listMyQuizzes } from '../services/quiz/QuizServices';
import { listMyAttempts } from '../services/attempt/AttemptServices';
import useNetReq from '../hooks/NetworkRequest';

/**
 * Modern Dashboard Screen with real statistics
 */
function DashboardScreen() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { fetchData } = useNetReq();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const abortContRef = { current: null };

      // Fetch all data in parallel
      const [statsRes, quizzesRes, attemptsRes] = await Promise.allSettled([
        getUserStatistics(fetchData, abortContRef),
        listMyQuizzes(fetchData, abortContRef, { page: 1, limit: 3 }),
        listMyAttempts(fetchData, abortContRef, { page: 1, limit: 3 }),
      ]);

      console.log('Stats Response:', statsRes);
      console.log('Quizzes Response:', quizzesRes);
      console.log('Attempts Response:', attemptsRes);

      // Handle Stats
      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        // Extract data - handle both nested and flat structures
        const statsData = statsRes.value.data?.data || statsRes.value.data;
        console.log('Dashboard Stats Data:', statsData);

        setStats({
          quizzesCreated: statsData.quizzes_created || 0,
          quizzesTaken: statsData.total_quiz_attempts || 0,
          averageScore: Math.round(statsData.average_score || 0),
          totalPoints: statsData.total_points_earned || 0,
          passingRate: Math.round(statsData.pass_rate || 0),
          currentStreak: statsData.current_streak || 0,
        });
      } else {
        console.warn('Stats data missing or failed', statsRes);
      }

      // Handle Recent Quizzes
      if (quizzesRes.status === 'fulfilled' && quizzesRes.value.data) {
        const quizzesData = quizzesRes.value.data?.data || quizzesRes.value.data;
        console.log('Dashboard Quizzes Data:', quizzesData);
        setRecentQuizzes(quizzesData?.quizzes || []);
      } else {
        console.warn('Quizzes data missing or failed', quizzesRes);
      }

      // Handle Recent Attempts
      if (attemptsRes.status === 'fulfilled' && attemptsRes.value.data) {
        const attemptsData = attemptsRes.value.data?.data || attemptsRes.value.data;
        console.log('Dashboard Attempts Data:', attemptsData);
        setRecentAttempts(attemptsData?.attempts || []);
      } else {
        console.warn('Attempts data missing or failed', attemptsRes);
      }

    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load some dashboard data. Please try refreshing.');
      toast.error('Could not load complete dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'success',
      Medium: 'warning',
      Hard: 'error',
    };
    return colors[difficulty] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <SetBrowserTabTitle title="Dashboard" />
      <Box
        sx={{
          minHeight: 'calc(100vh - 72px)',
          backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#F8F9FA',
          py: 4,
          backgroundImage: theme.palette.mode === 'dark' 
            ? 'radial-gradient(circle at 50% 0%, rgba(108, 92, 231, 0.15) 0%, transparent 50%)' 
            : 'radial-gradient(circle at 50% 0%, rgba(108, 92, 231, 0.08) 0%, transparent 50%)',
        }}
      >
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 16px rgba(108, 92, 231, 0.2)',
                  border: '4px solid',
                  borderColor: 'background.paper',
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Hello, {user?.name?.split(' ')[0]}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Let's learn something new today.
                </Typography>
              </Box>
            </Box>
            <Box>
               <IconButton
                  onClick={() => fetchDashboardData(true)}
                  disabled={loading || refreshing}
                  sx={{
                    backgroundColor: 'background.paper',
                    boxShadow: 1,
                    transition: 'all 0.3s',
                    mr: 2,
                    '&:hover': { 
                      backgroundColor: 'background.paper',
                      transform: 'rotate(180deg)',
                      boxShadow: 3
                    },
                  }}
                >
                  <RefreshIcon color={refreshing ? "primary" : "action"} />
                </IconButton>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateModalOpen(true)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
                    boxShadow: '0 8px 20px -8px #6C5CE7',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5b4cc4 0%, #8c85e6 100%)',
                      boxShadow: '0 12px 24px -10px #6C5CE7',
                      transform: 'translateY(-2px)'
                    },
                  }}
                >
                  Create New Quiz
                </Button>
            </Box>
          </Box>

          {error && (
             <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
             </Alert>
          )}

          {/* AI Feature Card */}
          <Card
            sx={{
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 4,
              border: 'none',
              boxShadow: '0 12px 24px -10px rgba(102, 126, 234, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 32px -10px rgba(102, 126, 234, 0.6)',
              },
            }}
            onClick={() => navigate(ROUTES.AI_GENERATE)}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                opacity: 0.95,
              }}
            />
            <CardContent sx={{ position: 'relative', zIndex: 2, p: 4, color: 'white' }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderRadius: 2,
                        display: 'flex',
                      }}
                    >
                      <AutoAwesomeIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Chip
                      label="NEW"
                      size="small"
                      sx={{
                        bgcolor: '#43e97b',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    AI-Powered Quiz Generation
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.95, mb: 2 }}>
                    Let AI create quizzes for you! Generate questions from text, upload documents, or extract from images.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label="From Text"
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip
                      label="From Documents"
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip
                      label="From Images"
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  >
                    Try AI Generation
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <StatsIcon color="primary" /> Your Progress
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Stats Cards - Array based generation for clean code */}
            {[
              { 
                label: 'Quizzes Created', 
                value: stats?.quizzesCreated, 
                icon: <QuizIcon sx={{ fontSize: 32 }} />,
                gradient: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
                shadowColor: '#6C5CE7'
              },
              { 
                label: 'Quizzes Taken', 
                value: stats?.quizzesTaken, 
                icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
                gradient: 'linear-gradient(135deg, #FF7675 0%, #FAB1A0 100%)',
                shadowColor: '#FF7675'
              },
              { 
                label: 'Avg. Score', 
                value: stats ? `${stats.averageScore}%` : null, 
                icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
                gradient: 'linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)',
                shadowColor: '#0984e3'
              },
              { 
                label: 'Total Points', 
                value: stats?.totalPoints, 
                icon: <TrophyIcon sx={{ fontSize: 32 }} />,
                gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
                shadowColor: '#00b894'
              },
              { 
                label: 'Day Streak', 
                value: stats?.currentStreak, 
                icon: <FireIcon sx={{ fontSize: 32 }} />,
                gradient: 'linear-gradient(135deg, #e17055 0%, #ffbe76 100%)',
                shadowColor: '#e17055'
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    borderRadius: 4,
                    boxShadow: loading ? 'none' : `0 10px 20px -10px ${stat.shadowColor}40`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: 'none',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: `0 14px 28px -10px ${stat.shadowColor}60`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: stat.gradient,
                      opacity: 0.9,
                      borderRadius: 4,
                      zIndex: 1,
                    }}
                  />
                  <CardContent sx={{ position: 'relative', zIndex: 2, color: 'white', p: '24px !important' }}>
                    {loading ? (
                      <Skeleton variant="rectangular" width="100%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    ) : (
                      <>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 2 
                        }}>
                          <Box sx={{ 
                            p: 1, 
                            bgcolor: 'rgba(255,255,255,0.2)', 
                            borderRadius: 2,
                            display: 'flex'
                          }}>
                            {stat.icon}
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, fontSize: '2.5rem' }}>
                          {stat.value ?? 0}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.9 }}>
                          {stat.label}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity Section - Split View */}
          <Grid container spacing={3}>
            {/* Recent Quizzes Side */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QuizIcon color="primary" /> Recent Quizzes
                  </Typography>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(ROUTES.QUIZ_LIST)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    View All
                  </Button>
                </Box>
                
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 3 }} />
                  ))
                ) : recentQuizzes.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentQuizzes.map((quiz) => (
                      <Paper
                        key={quiz.id}
                        elevation={0}
                        onClick={() => navigate(`/quizzes/${quiz.id}`)}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            borderColor: 'primary.main',
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(108, 92, 231, 0.1)' : 'rgba(108, 92, 231, 0.04)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {quiz.title}
                            </Typography>
                            <Chip
                              label={quiz.is_published ? 'Published' : 'Draft'}
                              size="small"
                              color={quiz.is_published ? 'success' : 'default'}
                              variant={quiz.is_published ? 'filled' : 'outlined'}
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Chip
                            label={quiz.difficulty || 'Medium'}
                            size="small"
                            color={getDifficultyColor(quiz.difficulty)}
                            sx={{ borderRadius: 2, height: 24, fontSize: '0.75rem', fontWeight: 600 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            • {quiz.questions?.length ?? quiz.question_count ?? 0} Questions
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                             {formatDate(quiz.created_at)}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6, opacity: 0.7 }}>
                     <Box sx={{ 
                        width: 80, height: 80, borderRadius: '50%', 
                        bgcolor: 'action.hover', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' 
                     }}>
                        <AddIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                     </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>No quizzes created yet</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>start your teaching journey today</Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
                        Create Now
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Recent Attempts Side */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ExploreIcon color="secondary" /> Recent Attempts
                  </Typography>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(ROUTES.ATTEMPT_LIST)}
                    size="small"
                    color="secondary"
                    sx={{ borderRadius: 2 }}
                  >
                    View All
                  </Button>
                </Box>

                {loading ? (
                   Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 3 }} />
                  ))
                ) : recentAttempts.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentAttempts.map((attempt) => (
                      <Paper
                        key={attempt.id}
                        elevation={0}
                        onClick={() => navigate(`/attempts/${attempt.id}/results`)}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            borderColor: 'secondary.main',
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(253, 121, 168, 0.1)' : 'rgba(253, 121, 168, 0.04)',
                          },
                        }}
                      >
                         {/* Progress bar background */}
                         <Box sx={{
                             position: 'absolute', bottom: 0, left: 0, height: 3,
                             width: `${(attempt.score / attempt.max_score) * 100}%`,
                             bgcolor: attempt.passed ? 'success.main' : 'error.main',
                             opacity: 0.8
                         }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                           <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {attempt.quiz_title || 'Untitled Quiz'}
                           </Typography>
                           <Typography variant="button" sx={{
                               color: attempt.passed ? 'success.main' : 'error.main',
                               fontWeight: 700
                           }}>
                              {attempt.score}/{attempt.max_score}
                           </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(attempt.submitted_at || attempt.started_at)}
                            </Typography>
                            {attempt.started_at && attempt.submitted_at && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                      {(() => {
                                        const start = new Date(attempt.started_at);
                                        const end = new Date(attempt.submitted_at);
                                        const diffMinutes = Math.round((end - start) / 60000);
                                        return `${diffMinutes} min`;
                                      })()}
                                  </Typography>
                              </Box>
                            )}
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6, opacity: 0.7 }}>
                     <Box sx={{ 
                        width: 80, height: 80, borderRadius: '50%', 
                        bgcolor: 'action.hover', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' 
                     }}>
                        <ExploreIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                     </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>No attempts yet</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Challenge yourself with a quiz!</Typography>
                     <Button variant="outlined" color="secondary" startIcon={<ExploreIcon />} onClick={() => navigate(ROUTES.DISCOVER)}>
                        Discover Quizzes
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Create Quiz Modal */}
      <CreateQuizModal
        open={createModalOpen}
        onClose={() => {
             setCreateModalOpen(false);
             fetchDashboardData(true); // Refresh data after creation
        }}
      />
    </>
  );
}

export default DashboardScreen;
