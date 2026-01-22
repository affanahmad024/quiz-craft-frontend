// Attempt List Screen
// Display user's quiz attempt history
// Following Phoenix pattern

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import AttemptCard from '../../components/attempt/AttemptCard';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { toast } from 'react-hot-toast';

function AttemptListScreen() {
  const navigate = useNavigate();
  const { attempts, isLoading, listMyAttempts } = useAttempt();

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch attempts on mount
  useEffect(() => {
    const fetchAttempts = async () => {
      const response = await listMyAttempts();
      if (!response.success) {
        toast.error(response.error || 'Failed to load attempts');
      }
    };

    fetchAttempts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = attempts.length;
    const submitted = attempts.filter((a) => a.status === 'submitted').length;
    const passed = attempts.filter((a) => a.passed === true).length;
    const inProgress = attempts.filter((a) => a.status === 'in_progress').length;
    const avgScore =
      submitted > 0
        ? attempts
            .filter((a) => a.status === 'submitted' && a.percentage)
            .reduce((sum, a) => sum + a.percentage, 0) / submitted
        : 0;

    return { total, submitted, passed, inProgress, avgScore };
  }, [attempts]);

  // Filter and sort attempts
  const filteredAndSortedAttempts = useMemo(() => {
    let filtered = attempts;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((attempt) => attempt.status === statusFilter);
    }

    // Sort attempts
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.started_at) - new Date(a.started_at);
        case 'oldest':
          return new Date(a.started_at) - new Date(b.started_at);
        case 'score-high':
          return (b.percentage || 0) - (a.percentage || 0);
        case 'score-low':
          return (a.percentage || 0) - (b.percentage || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [attempts, statusFilter, sortBy]);

  // Handle status filter change
  const handleStatusFilterChange = (event, newValue) => {
    setStatusFilter(newValue);
  };

  // Handle view results
  const handleViewResults = (attempt) => {
    navigate(buildRoute(ROUTES.ATTEMPT_RESULTS, { id: attempt.id }));
  };

  // Handle continue attempt
  const handleContinueAttempt = (attempt) => {
    navigate(buildRoute(ROUTES.QUIZ_TAKE, { id: attempt.quiz_id, attemptId: attempt.id }));
  };

  if (isLoading && attempts.length === 0) {
    return <LoadingScreen message="Loading your attempts..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#2D3436',
              mb: 1,
            }}
          >
            My Attempts
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#636E72',
            }}
          >
            Track your quiz history and performance
          </Typography>
        </Box>

        {/* Statistics Cards */}
        {attempts.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E8E8E8',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon sx={{ color: '#667eea', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#636E72' }}>
                    Total Attempts
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3436' }}>
                  {stats.total}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E8E8E8',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ color: '#43e97b', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#636E72' }}>
                    Passed
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3436' }}>
                  {stats.passed}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E8E8E8',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#764ba2', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#636E72' }}>
                    Avg Score
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3436' }}>
                  {stats.avgScore.toFixed(1)}%
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E8E8E8',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HourglassIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#636E72' }}>
                    In Progress
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3436' }}>
                  {stats.inProgress}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters Card */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs
              value={statusFilter}
              onChange={handleStatusFilterChange}
              sx={{
                flex: 1,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#636E72',
                  '&.Mui-selected': {
                    color: '#667eea',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                },
              }}
            >
              <Tab label="All" value="all" />
              <Tab label="Submitted" value="submitted" />
              <Tab label="In Progress" value="in_progress" />
              <Tab label="Expired" value="expired" />
            </Tabs>

            <Box sx={{ px: 3, minWidth: 200 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E8E8E8',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  }}
                >
                  <MenuItem value="recent">Most Recent</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="score-high">Highest Score</MenuItem>
                  <MenuItem value="score-low">Lowest Score</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Card>

        {/* Attempts Grid or Empty State */}
        {filteredAndSortedAttempts.length === 0 ? (
          <Card
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid #E8E8E8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ mb: 2 }}>
              {statusFilter === 'all' ? (
                <AssignmentIcon sx={{ fontSize: 64, color: '#B2BEC3' }} />
              ) : statusFilter === 'submitted' ? (
                <CheckCircleIcon sx={{ fontSize: 64, color: '#B2BEC3' }} />
              ) : statusFilter === 'in_progress' ? (
                <HourglassIcon sx={{ fontSize: 64, color: '#B2BEC3' }} />
              ) : (
                <CancelIcon sx={{ fontSize: 64, color: '#B2BEC3' }} />
              )}
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#2D3436',
                fontWeight: 600,
                mb: 1,
              }}
            >
              {attempts.length === 0 ? 'No Attempts Yet' : 'No Attempts Match Your Filter'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#636E72',
              }}
            >
              {attempts.length === 0
                ? "You haven't attempted any quizzes yet. Start exploring quizzes to begin!"
                : 'Try selecting a different filter to see more attempts.'}
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredAndSortedAttempts.map((attempt) => (
              <Grid item xs={12} sm={6} md={4} key={attempt.id}>
                <AttemptCard
                  attempt={attempt}
                  onViewResults={handleViewResults}
                  onContinue={handleContinueAttempt}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default AttemptListScreen;
