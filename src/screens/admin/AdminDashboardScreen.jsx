// Admin Dashboard Screen
// Main admin dashboard with platform statistics
// Following Phoenix pattern

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAdmin } from '../../contexts/admin/AdminContextProvider';
import { ROUTES } from '../../constants/RouteConstants';
import { COLORS } from '../../constants/ColorConstants';
import StatsCard from '../../components/profile/StatsCard';
import LoadingScreen from '../../components/screens/LoadingScreen';

/**
 * Admin Dashboard Screen
 * Overview of platform statistics
 */
function AdminDashboardScreen() {
  const navigate = useNavigate();
  const { platformStats, isLoading, getPlatformStats } = useAdmin();

  useEffect(() => {
    getPlatformStats();
  }, []);

  if (isLoading && !platformStats) {
    return <LoadingScreen />;
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
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 1,
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 4,
          }}
        >
          Platform Overview and Management
        </Typography>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Users"
              value={platformStats?.total_users || 0}
              subtitle={`${platformStats?.new_users_today || 0} new today`}
              icon={PeopleIcon}
              color={COLORS.PRIMARY}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Quizzes"
              value={platformStats?.total_quizzes || 0}
              subtitle={`${platformStats?.published_quizzes || 0} published`}
              icon={QuizIcon}
              color={COLORS.SUCCESS}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Attempts"
              value={platformStats?.total_attempts || 0}
              subtitle={`${platformStats?.completed_attempts || 0} completed`}
              icon={TrendingUpIcon}
              color={COLORS.WARNING}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Completion Rate"
              value={`${platformStats?.average_completion_rate?.toFixed(1) || 0}%`}
              subtitle="Overall"
              icon={AssessmentIcon}
              color={COLORS.SECONDARY}
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<PeopleIcon />}
                onClick={() => navigate(ROUTES.ADMIN_USERS)}
                sx={{
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                }}
              >
                Manage Users
              </Button>
              <Button
                variant="contained"
                startIcon={<QuizIcon />}
                onClick={() => navigate(ROUTES.ADMIN_QUIZZES)}
                sx={{
                  background: 'linear-gradient(135deg, #00B894 0%, #55EFC4 100%)',
                }}
              >
                Manage Quizzes
              </Button>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                onClick={() => navigate(ROUTES.ADMIN_STATS)}
                sx={{
                  background: 'linear-gradient(135deg, #FDCB6E 0%, #FD79A8 100%)',
                }}
              >
                View Statistics
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AdminDashboardScreen;
