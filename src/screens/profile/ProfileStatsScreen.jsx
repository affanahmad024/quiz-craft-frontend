// Profile Statistics Screen
// Detailed statistics view
// Following Phoenix pattern

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Create as CreateIcon,
  Publish as PublishIcon,
  Visibility as ViewIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
  Grade as ScoreIcon,
  Stars as StarsIcon,
  Whatshot as WhatshotIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { ROUTES } from '../../constants/RouteConstants';
import { COLORS } from '../../constants/ColorConstants';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import StatsCard from '../../components/profile/StatsCard';
import { useProfile } from '../../contexts/profile/ProfileContextProvider';
import toast from 'react-hot-toast';

/**
 * Profile Statistics Screen
 * Displays comprehensive user statistics
 */
function ProfileStatsScreen() {
  const navigate = useNavigate();
  const { statistics, isLoading, getStatistics } = useProfile();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getStatistics();
        if (!response.success) {
          toast.error('Failed to load statistics');
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
        toast.error('Failed to load statistics');
      }
    };

    fetchStatistics();
  }, []);

  const handleBack = () => {
    navigate(ROUTES.PROFILE);
  };

  // Loading state
  if (isLoading && !statistics) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              mb: 1,
            }}
          >
            <IconButton
              onClick={handleBack}
              sx={{
                color: 'white',
                position: 'absolute',
                left: 0,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              }}
            >
              Detailed Statistics
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: '0.9rem', md: '1rem' },
              textAlign: 'center',
            }}
          >
            Your comprehensive performance overview
          </Typography>
        </Box>

        {/* Quiz Creation Stats Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <CreateIcon sx={{ color: 'white', mr: 1, fontSize: 24 }} />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Quiz Creation Statistics
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mb: 2.5 }} />

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Quizzes Created"
                value={statistics?.quizzes_created || 0}
                icon={CreateIcon}
                color={COLORS.PRIMARY}
                subtitle="Total quizzes"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Published Quizzes"
                value={statistics?.published_quizzes || 0}
                icon={PublishIcon}
                color={COLORS.SUCCESS}
                subtitle="Public quizzes"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Views"
                value={statistics?.total_quiz_views || 0}
                icon={ViewIcon}
                color={COLORS.INFO}
                subtitle="Quiz views"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Attempts"
                value={statistics?.total_quiz_attempts || 0}
                icon={TrendingUpIcon}
                color={COLORS.SECONDARY}
                subtitle="On your quizzes"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Quiz Taking Stats Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <QuizIcon sx={{ color: 'white', mr: 1, fontSize: 24 }} />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Quiz Taking Statistics
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mb: 2.5 }} />

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Quizzes Taken"
                value={statistics?.quizzes_taken || 0}
                icon={QuizIcon}
                color={COLORS.INFO}
                subtitle="Different quizzes"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Attempts Completed"
                value={statistics?.attempts_completed || 0}
                icon={AssessmentIcon}
                color={COLORS.PRIMARY}
                subtitle="Total attempts"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Average Score"
                value={
                  statistics?.average_score
                    ? `${Math.round(statistics.average_score)}%`
                    : '0%'
                }
                icon={ScoreIcon}
                color={COLORS.SUCCESS}
                subtitle="Overall performance"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Points"
                value={statistics?.total_points_earned || 0}
                icon={StarsIcon}
                color={COLORS.WARNING}
                subtitle="Points earned"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Performance Stats Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <TrendingUpIcon sx={{ color: 'white', mr: 1, fontSize: 24 }} />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Performance Statistics
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mb: 2.5 }} />

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Quizzes Passed"
                value={statistics?.quizzes_passed || 0}
                icon={CheckCircleIcon}
                color={COLORS.SUCCESS}
                subtitle="Successful attempts"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Pass Rate"
                value={
                  statistics?.pass_rate
                    ? `${Math.round(statistics.pass_rate)}%`
                    : '0%'
                }
                icon={CheckCircleIcon}
                color={COLORS.SECONDARY}
                subtitle="Success rate"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Current Streak"
                value={statistics?.current_streak || 0}
                icon={WhatshotIcon}
                color={COLORS.ERROR}
                subtitle="days active"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Longest Streak"
                value={statistics?.longest_streak || 0}
                icon={WhatshotIcon}
                color={COLORS.WARNING}
                subtitle="days record"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default ProfileStatsScreen;
