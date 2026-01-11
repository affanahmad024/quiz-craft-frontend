// Root App Component
// Following Phoenix pattern

import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import PropTypes from 'prop-types';
import { ROUTES } from './constants/RouteConstants';
import PageNotFound from './components/screens/PageNotFound';
import { authRoutes } from './routes/AuthRoutes';
import { quizRoutes } from './routes/QuizRoutes';
import { attemptRoutes } from './routes/AttemptRoutes';
import RequireAuth from './guards/RequireAuth';
import BasicLayout from './layouts/BasicLayout';
import DashboardScreen from './screens/DashboardScreen';

function App() {
  return (
    <Routes>
      {/* Home Route - Redirect to Dashboard or Login */}
      <Route path={ROUTES.HOME} element={<HomePage />} />

      {/* Auth Routes */}
      {authRoutes}

      {/* Quiz Routes */}
      {quizRoutes}

      {/* Attempt Routes */}
      {attemptRoutes}

      {/* Dashboard Route */}
      <Route
        element={
          <RequireAuth>
            <BasicLayout />
          </RequireAuth>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardScreen />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

// Temporary Home Page Component for Testing
function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            mt: 10,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Welcome to QuizCraft
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            Create Engaging Quizzes, Learn & Grow
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Learn More
            </Button>
          </Box>

          <Box
            sx={{
              mt: 10,
              p: 4,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Phase 1: Foundation Setup - Complete! ✅
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
                textAlign: 'left',
              }}
            >
              <FeatureBox
                title="Core Setup"
                items={[
                  'Folder structure',
                  'Dependencies installed',
                  'MUI Theme configured',
                ]}
              />
              <FeatureBox
                title="Utilities"
                items={[
                  'API functions',
                  'LocalStorage helpers',
                  'Validation functions',
                ]}
              />
              <FeatureBox
                title="Components"
                items={[
                  'Button component',
                  'Input component',
                  'Loading screens',
                ]}
              />
            </Box>
          </Box>
        </Box>
      </Container>

      <Box
        sx={{
          textAlign: 'center',
          py: 3,
          color: 'rgba(255, 255, 255, 0.8)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="body2">
          © 2026 QuizCraft - Built with React & Material-UI
        </Typography>
      </Box>
    </Box>
  );
}

function FeatureBox({ title, items }) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, mb: 1.5, color: 'white' }}
      >
        {title}
      </Typography>
      {items.map((item, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.85)',
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>✓</span> {item}
        </Typography>
      ))}
    </Box>
  );
}

FeatureBox.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default App
