// Notification Item Component
// Single notification display with icon and actions
// Following Phoenix pattern

import { Box, Typography, IconButton, Avatar } from '@mui/material';
import {
  Close as CloseIcon,
  Quiz as QuizIcon,
  Event as EventIcon,
  Alarm as AlarmIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useNotifications } from '../../contexts/notifications/NotificationContextProvider';
import { NOTIFICATION_TYPES, NOTIFICATION_TYPE_COLORS, NOTIFICATION_SETTINGS } from '../../constants/NotificationConstants';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';

/**
 * Get icon component based on notification type
 */
const getNotificationIcon = (type) => {
  const iconMap = {
    [NOTIFICATION_TYPES.NEW_QUIZ]: QuizIcon,
    [NOTIFICATION_TYPES.LIVE_SESSION_SCHEDULED]: EventIcon,
    [NOTIFICATION_TYPES.LIVE_SESSION_STARTING]: AlarmIcon,
    [NOTIFICATION_TYPES.LIVE_SESSION_INVITATION]: MailIcon,
    [NOTIFICATION_TYPES.NEW_FOLLOWER]: PersonIcon,
    [NOTIFICATION_TYPES.SYSTEM]: NotificationsIcon,
  };

  return iconMap[type] || NotificationsIcon;
};

/**
 * Get relative time string (e.g., "2 hours ago", "yesterday")
 */
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffMs = now - notificationTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return notificationTime.toLocaleDateString();
};

/**
 * NotificationItem Component
 * Displays a single notification with appropriate styling
 */
function NotificationItem({ notification, onClose }) {
  const navigate = useNavigate();
  const { markAsRead, removeNotification } = useNotifications();

  const IconComponent = getNotificationIcon(notification.type);
  const iconColor = NOTIFICATION_TYPE_COLORS[notification.type] || '#3b82f6';
  const isUnread = !notification.is_read;

  const handleClick = async () => {
    // Mark as read if configured
    if (NOTIFICATION_SETTINGS.MARK_AS_READ_ON_CLICK && isUnread) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type and data
    if (notification.data) {
      switch (notification.type) {
        case NOTIFICATION_TYPES.NEW_QUIZ:
          if (notification.data.quiz_id) {
            navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id: notification.data.quiz_id }));
            onClose?.();
          }
          break;
        case NOTIFICATION_TYPES.LIVE_SESSION_SCHEDULED:
        case NOTIFICATION_TYPES.LIVE_SESSION_STARTING:
        case NOTIFICATION_TYPES.LIVE_SESSION_INVITATION:
          // Will navigate to live session page when implemented
          console.log('Navigate to live session:', notification.data.session_id);
          break;
        case NOTIFICATION_TYPES.NEW_FOLLOWER:
          // Will navigate to followers page when implemented
          console.log('Navigate to followers');
          break;
        default:
          break;
      }
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering the notification click
    await removeNotification(notification.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 2,
          cursor: 'pointer',
          backgroundColor: isUnread ? 'rgba(13, 92, 63, 0.05)' : 'transparent',
          borderLeft: isUnread ? `3px solid ${iconColor}` : '3px solid transparent',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(13, 92, 63, 0.08)',
          },
        }}
      >
        {/* Icon */}
        <Avatar
          sx={{
            bgcolor: iconColor,
            width: 40,
            height: 40,
          }}
        >
          <IconComponent sx={{ fontSize: 20 }} />
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: isUnread ? 600 : 500,
              color: '#2D3436',
              mb: 0.5,
            }}
          >
            {notification.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#636E72',
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 0.5,
            }}
          >
            {notification.message}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#95A5A6',
              fontSize: '0.75rem',
            }}
          >
            {getRelativeTime(notification.created_at)}
          </Typography>
        </Box>

        {/* Delete Button */}
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            alignSelf: 'flex-start',
            opacity: 0.6,
            '&:hover': {
              opacity: 1,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
            },
          }}
          aria-label="Delete notification"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </motion.div>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    data: PropTypes.object,
    is_read: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func,
};

export default NotificationItem;
