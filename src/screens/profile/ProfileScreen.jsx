// Profile Screen
// View user profile with statistics
// Following Phoenix pattern

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Create as CreateIcon,
  Quiz as QuizIcon,
  Grade as ScoreIcon,
  CheckCircle as CheckCircleIcon,
  Stars as StarsIcon,
  Whatshot as WhatshotIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { ROUTES } from '../../constants/RouteConstants';
import { COLORS } from '../../constants/ColorConstants';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import StatsCard from '../../components/profile/StatsCard';
import { useProfile } from '../../contexts/profile/ProfileContextProvider';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
import toast from 'react-hot-toast';

/**
 * Profile Screen
 * Displays user profile information and statistics
 */
function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, statistics, isLoading, getProfile, getStatistics } = useProfile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getProfile(), getStatistics()]);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    navigate(ROUTES.PROFILE_EDIT);
  };

  const handleViewStats = () => {
    navigate(ROUTES.PROFILE_STATS);
  };

  const handleChangePassword = () => {
    navigate(ROUTES.CHANGE_PASSWORD);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (isLoading && !profile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
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
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            My Profile
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            View and manage your account information
          </Typography>
        </Box>

        {/* User Info Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: COLORS.PRIMARY_LIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3,
                }}
              >
                <PersonIcon sx={{ fontSize: 40, color: COLORS.PRIMARY }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {profile?.name || user?.name || 'User'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {profile?.role || user?.role || 'Member'}
                  </Typography>
                  {(profile?.is_verified || user?.is_verified) && (
                    <Chip
                      label="Verified"
                      color="success"
                      size="small"
                      sx={{ height: 20 }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1.5, color: COLORS.PRIMARY }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2">
                      {profile?.email || user?.email || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1.5, color: COLORS.PRIMARY }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">
                      {profile?.phone_number || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1.5, color: COLORS.PRIMARY }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Joined
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(profile?.created_at || user?.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <QuizCraftButton
                variant="contained"
                onClick={handleEditProfile}
                startIcon={<CreateIcon />}
              >
                Edit Profile
              </QuizCraftButton>
              <QuizCraftButton
                variant="outlined"
                onClick={handleViewStats}
                startIcon={<StarsIcon />}
              >
                View Detailed Stats
              </QuizCraftButton>
              <QuizCraftButton
                variant="outlined"
                onClick={handleChangePassword}
              >
                Change Password
              </QuizCraftButton>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Your Statistics
          </Typography>
        </Box>

        {/* Statistics Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Quizzes Created"
              value={statistics?.quizzes_created || 0}
              icon={CreateIcon}
              color={COLORS.PRIMARY}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Quizzes Taken"
              value={statistics?.quizzes_taken || 0}
              icon={QuizIcon}
              color={COLORS.INFO}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Average Score"
              value={
                statistics?.average_score
                  ? `${Math.round(statistics.average_score)}%`
                  : '0%'
              }
              icon={ScoreIcon}
              color={COLORS.SUCCESS}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Pass Rate"
              value={
                statistics?.pass_rate
                  ? `${Math.round(statistics.pass_rate)}%`
                  : '0%'
              }
              icon={CheckCircleIcon}
              color={COLORS.SECONDARY}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Total Points"
              value={statistics?.total_points_earned || 0}
              icon={StarsIcon}
              color={COLORS.WARNING}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Current Streak"
              value={statistics?.current_streak || 0}
              icon={WhatshotIcon}
              color={COLORS.ERROR}
              subtitle="days"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProfileScreen;
