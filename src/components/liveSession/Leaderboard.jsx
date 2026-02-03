// Leaderboard Component
// Live leaderboard display for sessions
// Following Phoenix pattern

import { Box, Typography, Avatar, Paper } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Leaderboard Component
 * Shows ranked list of participants with scores
 */
function Leaderboard({ leaderboard = [], myRank = null, maxDisplay = 10, compact = false }) {
  const displayedLeaderboard = leaderboard.slice(0, maxDisplay);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#0D5C3F'; // Default green
    }
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <TrophyIcon sx={{ color: getRankColor(rank), fontSize: 20 }} />;
    }
    return null;
  };

  if (leaderboard.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No leaderboard data yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      {!compact && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid #E0E0E0',
          }}
        >
          <TrophyIcon sx={{ color: '#FFD700' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Leaderboard
          </Typography>
        </Box>
      )}

      {/* Leaderboard List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: compact ? 0.5 : 1 }}>
        {displayedLeaderboard.map((entry, index) => {
          const isCurrentUser = entry.rank === myRank;

          return (
            <motion.div
              key={entry.user_id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Paper
                elevation={isCurrentUser ? 3 : 0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: compact ? 1 : 2,
                  p: compact ? 1 : 1.5,
                  backgroundColor: isCurrentUser
                    ? 'rgba(13, 92, 63, 0.1)'
                    : 'transparent',
                  border: isCurrentUser ? '2px solid #0D5C3F' : '1px solid #E0E0E0',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: isCurrentUser
                      ? 'rgba(13, 92, 63, 0.15)'
                      : 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                {/* Rank */}
                <Box
                  sx={{
                    width: compact ? 32 : 40,
                    height: compact ? 32 : 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: getRankColor(entry.rank),
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: compact ? '0.875rem' : '1rem',
                  }}
                >
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                </Box>

                {/* Avatar & Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <Avatar
                    sx={{
                      width: compact ? 32 : 40,
                      height: compact ? 32 : 40,
                      bgcolor: '#0D5C3F',
                      fontSize: compact ? '0.875rem' : '1rem',
                    }}
                  >
                    {entry.user_name?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isCurrentUser ? 600 : 500,
                        fontSize: compact ? '0.875rem' : '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.user_name}
                      {isCurrentUser && (
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            color: '#0D5C3F',
                            fontWeight: 700,
                          }}
                        >
                          (You)
                        </Box>
                      )}
                    </Typography>
                    {!compact && entry.correct_answers !== undefined && (
                      <Typography variant="caption" color="text.secondary">
                        {entry.correct_answers}/{entry.total_answers || 0} correct
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Score */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0D5C3F',
                      fontSize: compact ? '1rem' : '1.25rem',
                    }}
                  >
                    {entry.score}
                  </Typography>
                  {!compact && (
                    <Typography variant="caption" color="text.secondary">
                      points
                    </Typography>
                  )}
                </Box>
              </Paper>
            </motion.div>
          );
        })}
      </Box>

      {/* Show more indicator */}
      {leaderboard.length > maxDisplay && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            +{leaderboard.length - maxDisplay} more participants
          </Typography>
        </Box>
      )}
    </Box>
  );
}

Leaderboard.propTypes = {
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      rank: PropTypes.number.isRequired,
      user_id: PropTypes.string,
      user_name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      correct_answers: PropTypes.number,
      total_answers: PropTypes.number,
    })
  ),
  myRank: PropTypes.number,
  maxDisplay: PropTypes.number,
  compact: PropTypes.bool,
};

export default Leaderboard;
