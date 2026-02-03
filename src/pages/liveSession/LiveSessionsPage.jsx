// Live Sessions Page
// Browse and discover public live sessions
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLiveSession } from '../../contexts/liveSession/LiveSessionContextProvider';
import { SESSION_STATUS } from '../../constants/LiveSessionConstants';
import { ROUTES } from '../../constants/RouteConstants';
import SessionCard from '../../components/liveSession/SessionCard';
import AnimatedPage from '../../components/animations/AnimatedPage';

/**
 * LiveSessionsPage Component
 * Browse and join public live sessions
 */
function LiveSessionsPage() {
  const navigate = useNavigate();
  const { publicSessions, isLoading, getPublicSessions } = useLiveSession();
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    await getPublicSessions();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleCreateSession = () => {
    navigate(ROUTES.LIVE_SESSION_CREATE);
  };

  const handleRefresh = () => {
    loadSessions();
  };

  // Filter sessions based on current tab
  const filteredSessions = publicSessions.filter((session) => {
    if (currentTab === 'all') return true;
    if (currentTab === 'live') return session.status === SESSION_STATUS.LIVE;
    if (currentTab === 'waiting') return session.status === SESSION_STATUS.WAITING;
    return true;
  });

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Live Sessions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join live quiz sessions or create your own
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSession}
              sx={{
                background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
                },
              }}
            >
              Create Session
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Sessions" value="all" />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🔴 Live Now
                </Box>
              }
              value="live"
            />
            <Tab label="Starting Soon" value="waiting" />
          </Tabs>
        </Paper>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Sessions Grid */}
        {!isLoading && filteredSessions.length > 0 && (
          <Grid container spacing={3}>
            {filteredSessions.map((session) => (
              <Grid item xs={12} sm={6} md={4} key={session.id}>
                <SessionCard session={session} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!isLoading && filteredSessions.length === 0 && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'rgba(13, 92, 63, 0.02)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              {currentTab === 'live'
                ? 'No live sessions right now'
                : currentTab === 'waiting'
                ? 'No sessions starting soon'
                : 'No sessions available'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {currentTab === 'all'
                ? 'Be the first to create a live session!'
                : 'Check back later or create your own session'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSession}
              sx={{
                background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
                },
              }}
            >
              Create Session
            </Button>
          </Paper>
        )}
      </Container>
    </AnimatedPage>
  );
}

export default LiveSessionsPage;
