// Notification Dropdown Component
// Displays recent notifications in a dropdown menu or drawer
// Following Phoenix pattern

import { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Menu,
  CircularProgress,
} from '@mui/material';
import {
  DoneAll as DoneAllIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useNotifications } from '../../contexts/notifications/NotificationContextProvider';
import NotificationItem from './NotificationItem';
import { NOTIFICATION_SETTINGS } from '../../constants/NotificationConstants';
import EmptyState from '../screens/EmptyState';

/**
 * NotificationDropdown Component
 * Shows recent notifications in a dropdown or drawer
 */
function NotificationDropdown({ anchorEl, open, onClose, isMobile = false }) {
  const {
    notifications,
    isLoading,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
    refresh,
  } = useNotifications();

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open && notifications.length === 0) {
      fetchNotifications({
        limit: NOTIFICATION_SETTINGS.MAX_DROPDOWN_ITEMS,
        offset: 0,
      });
    }
  }, [open, notifications.length, fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleRefresh = async () => {
    await refresh();
  };

  const recentNotifications = isMobile
    ? notifications
    : notifications.slice(0, NOTIFICATION_SETTINGS.MAX_DROPDOWN_ITEMS);

  const content = (
    <Box
      sx={{
        width: isMobile ? '100%' : 400,
        maxHeight: isMobile ? '100vh' : 600,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8F9FA',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            color: '#2D3436',
          }}
        >
          Notifications
          {unreadCount > 0 && (
            <Box
              component="span"
              sx={{
                ml: 1,
                backgroundColor: '#ef4444',
                color: '#ffffff',
                borderRadius: '12px',
                px: 1,
                py: 0.25,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
            sx={{
              minWidth: 'auto',
              px: 1,
              color: '#636E72',
              '&:hover': {
                backgroundColor: 'rgba(13, 92, 63, 0.05)',
              },
            }}
          >
            {isMobile && 'Refresh'}
          </Button>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
              sx={{
                minWidth: 'auto',
                px: 1,
                color: '#0D5C3F',
                '&:hover': {
                  backgroundColor: 'rgba(13, 92, 63, 0.05)',
                },
              }}
            >
              {isMobile && 'Mark all read'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Notifications List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#CBD5E0',
            borderRadius: '3px',
          },
        }}
      >
        {isLoading && notifications.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 6,
            }}
          >
            <CircularProgress size={32} sx={{ color: '#0D5C3F' }} />
          </Box>
        ) : recentNotifications.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyState
              message="No notifications yet"
              description="We'll notify you when something important happens"
            />
          </Box>
        ) : (
          <AnimatePresence>
            {recentNotifications.map((notification, index) => (
              <Box key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onClose={onClose}
                />
                {index < recentNotifications.length - 1 && (
                  <Divider sx={{ borderColor: '#E0E0E0' }} />
                )}
              </Box>
            ))}
          </AnimatePresence>
        )}
      </Box>

      {/* Footer */}
      {!isMobile && notifications.length > NOTIFICATION_SETTINGS.MAX_DROPDOWN_ITEMS && (
        <>
          <Divider />
          <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#F8F9FA' }}>
            <Button
              fullWidth
              variant="text"
              onClick={onClose}
              sx={{
                color: '#0D5C3F',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(13, 92, 63, 0.05)',
                },
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  // For mobile, content is rendered directly in the Drawer
  if (isMobile) {
    return content;
  }

  // For desktop, render in a Menu (Popover)
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          overflow: 'visible',
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {content}
    </Menu>
  );
}

NotificationDropdown.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
};

export default NotificationDropdown;
