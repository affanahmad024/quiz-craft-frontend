// Session Card Component
// Display session information in a card format
// Following Phoenix pattern

import { Box, Typography, Button, Chip, Avatar, AvatarGroup } from '@mui/material';
import { useState } from 'react';
import {
  People as PeopleIcon,
  Timer as TimerIcon,
  Lock as LockIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  SESSION_STATUS,
  SESSION_STATUS_COLORS,
  SESSION_STATUS_LABELS,
  SESSION_TYPES,
} from '../../constants/LiveSessionConstants';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import AnimatedCard from '../animations/AnimatedCard';
import { useLiveSession } from '../../contexts/liveSession/LiveSessionContextProvider';

/**
 * SessionCard Component
 * Displays live session information in a card
 */
function SessionCard({ session }) {
  const navigate = useNavigate();
  const { joinSession } = useLiveSession();
  const [isJoining, setIsJoining] = useState(false);

  const statusColor = SESSION_STATUS_COLORS[session.status];
  const statusLabel = SESSION_STATUS_LABELS[session.status];
  const isLive = session.status === SESSION_STATUS.LIVE;
  const isWaiting = session.status === SESSION_STATUS.WAITING;
  const canJoin = isLive || isWaiting;

  const handleJoinClick = async () => {
    if (!canJoin) {
      navigate(buildRoute(ROUTES.LIVE_SESSION_RESULTS, { id: session.id }));
      return;
    }

    setIsJoining(true);
    const response = await joinSession(session.id).catch(() => ({ success: false }));
    setIsJoining(false);

    if (!response?.success) {
      return;
    }

    if (session.status === SESSION_STATUS.WAITING) {
      navigate(buildRoute(ROUTES.LIVE_SESSION_WAITING, { id: session.id }));
    } else if (session.status === SESSION_STATUS.LIVE) {
      navigate(buildRoute(ROUTES.LIVE_SESSION_LIVE, { id: session.id }));
    }
  };

  return (
    <AnimatedCard
      animateHover={true}
      sx={{
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Status Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: 16,
          zIndex: 1,
        }}
      >
        <motion.div animate={isLive ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              backgroundColor: statusColor,
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </motion.div>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Session Type Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {session.session_type === SESSION_TYPES.PRIVATE ? (
            <LockIcon sx={{ fontSize: 18, color: '#636E72' }} />
          ) : (
            <PublicIcon sx={{ fontSize: 18, color: '#0D5C3F' }} />
          )}
          <Typography variant="caption" color="text.secondary">
            {session.session_type === SESSION_TYPES.PRIVATE ? 'Private' : 'Public'} Session
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {session.title}
        </Typography>

        {/* Creator */}
        {session.creator_name && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            by {session.creator_name}
          </Typography>
        )}

        {/* Description */}
        {session.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {session.description}
          </Typography>
        )}

        {/* Session Details */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {/* Participants */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 18, color: '#636E72' }} />
            <Typography variant="body2" color="text.secondary">
              {session.participant_count || 0}
              {session.max_participants && `/${session.max_participants}`}
            </Typography>
          </Box>

          {/* Timer */}
          {(session.question_timer_seconds || session.whole_quiz_timer_seconds) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimerIcon sx={{ fontSize: 18, color: '#636E72' }} />
              <Typography variant="body2" color="text.secondary">
                {session.question_timer_seconds
                  ? `${session.question_timer_seconds}s per question`
                  : `${Math.round(session.whole_quiz_timer_seconds / 60)} min quiz`}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Scheduled Time */}
        {session.scheduled_at && isWaiting && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Starts: {new Date(session.scheduled_at).toLocaleString()}
          </Typography>
        )}

        {/* Action Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleJoinClick}
          disabled={!canJoin || isJoining}
          sx={{
            background: isLive
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
            color: '#ffffff',
            fontWeight: 600,
            '&:hover': {
              background: isLive
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                : 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
            },
            '&:disabled': {
              background: '#E0E0E0',
              color: '#95A5A6',
            },
          }}
        >
          {isJoining ? 'Joining...' : isLive ? 'Join Now' : isWaiting ? 'Join Waiting Room' : 'View Results'}
        </Button>

        {/* Access Code (for private sessions) */}
        {session.session_type === SESSION_TYPES.PRIVATE && session.access_code && (
          <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(13, 92, 63, 0.05)', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Access Code:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
              {session.access_code}
            </Typography>
          </Box>
        )}
      </Box>
    </AnimatedCard>
  );
}

SessionCard.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    creator_name: PropTypes.string,
    status: PropTypes.string.isRequired,
    session_type: PropTypes.string.isRequired,
    participant_count: PropTypes.number,
    max_participants: PropTypes.number,
    question_timer_seconds: PropTypes.number,
    whole_quiz_timer_seconds: PropTypes.number,
    scheduled_at: PropTypes.string,
    access_code: PropTypes.string,
  }).isRequired,
};

export default SessionCard;
