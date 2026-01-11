// Dashboard Screen
// Main dashboard for authenticated users
// Following Phoenix pattern

import { Box, Container, Typography, Card, CardContent, Button, Grid, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import { ROUTES } from '../constants/RouteConstants';
import QuizIcon from '@mui/icons-material/Quiz';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import LogoutIcon from '@mui/icons-material/Logout';

/**
 * Dashboard Screen - Main landing page after login
 */
function DashboardScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Card sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Welcome back, {user?.name || 'User'}!
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    {user?.email}
                  </Typography>
                  {user?.email_verified && (
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Verified"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {user?.role === 'admin' && (
                    <Chip
                      label="Admin"
                      size="small"
                      color="primary"
                      variant="filled"
                    />
                  )}
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/quizzes/create')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <AddCircleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Create Quiz
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Build your own quiz and share with others
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/quizzes')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <QuizIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  My Quizzes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your created quizzes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/discover')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <ExploreIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Discover
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore and take quizzes from the community
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/profile')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PersonIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your stats and manage your account
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity - Placeholder */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Recent Activity
            </Typography>
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                color: 'text.secondary',
              }}
            >
              <Typography variant="body1">
                No recent activity yet. Start creating or taking quizzes!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default DashboardScreen;
