// Attempt List Screen
// Display user's quiz attempt history
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import { Quiz as QuizIcon } from '@mui/icons-material';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import AttemptCard from '../../components/attempt/AttemptCard';
import LoadingScreen from '../../components/screens/LoadingScreen';
import EmptyState from '../../components/screens/EmptyState';
import { toast } from 'react-hot-toast';

function AttemptListScreen() {
  const navigate = useNavigate();
  const { attempts, isLoading, listMyAttempts } = useAttempt();

  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredAttempts, setFilteredAttempts] = useState([]);

  // Fetch attempts on mount
  useEffect(() => {
    const fetchAttempts = async () => {
      const response = await listMyAttempts();
      if (!response.success) {
        toast.error(response.error || 'Failed to load attempts');
      }
    };

    fetchAttempts();
  }, [listMyAttempts]);

  // Apply status filter
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAttempts(attempts);
    } else {
      setFilteredAttempts(
        attempts.filter((attempt) => attempt.status === statusFilter)
      );
    }
  }, [attempts, statusFilter]);

  // Handle status filter change
  const handleStatusFilterChange = (event, newValue) => {
    setStatusFilter(newValue);
  };

  // Handle view results
  const handleViewResults = (attempt) => {
    navigate(buildRoute(ROUTES.ATTEMPT_RESULTS, { id: attempt.id }));
  };

  if (isLoading && attempts.length === 0) {
    return <LoadingScreen message="Loading your attempts..." />;
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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            My Attempts
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            View your quiz attempt history and results
          </Typography>
        </Box>

        {/* Status Filter Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={statusFilter}
            onChange={handleStatusFilterChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
              },
            }}
          >
            <Tab label="All" value="all" />
            <Tab label="In Progress" value="in_progress" />
            <Tab label="Submitted" value="submitted" />
            <Tab label="Expired" value="expired" />
          </Tabs>
        </Card>

        {/* Attempts Grid or Empty State */}
        {filteredAttempts.length === 0 ? (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <EmptyState
                icon={QuizIcon}
                title={
                  attempts.length === 0
                    ? 'No Attempts Yet'
                    : 'No Attempts Match Your Filter'
                }
                description={
                  attempts.length === 0
                    ? 'You haven\'t attempted any quizzes yet. Start exploring quizzes to begin!'
                    : 'Try selecting a different filter to see more attempts.'
                }
              />
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredAttempts.map((attempt) => (
              <Grid item xs={12} sm={6} md={4} key={attempt.id}>
                <AttemptCard
                  attempt={attempt}
                  onViewResults={handleViewResults}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Loading Overlay */}
        {isLoading && attempts.length > 0 && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Card sx={{ p: 4 }}>
              <LoadingScreen message="Loading attempts..." />
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default AttemptListScreen;
