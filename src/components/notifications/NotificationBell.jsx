// Notification Bell Component
// Bell icon with unread badge for header
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import { IconButton, Badge, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNotifications } from '../../contexts/notifications/NotificationContextProvider';
import NotificationDropdown from './NotificationDropdown';

/**
 * NotificationBell Component
 * Shows bell icon with unread count badge
 * Opens dropdown (desktop) or drawer (mobile) on click
 */
function NotificationBell() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { unreadCount, fetchUnreadCount } = useNotifications();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  const isOpen = Boolean(anchorEl) || drawerOpen;

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Trigger pulse animation when unread count increases
  useEffect(() => {
    if (unreadCount > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const handleClick = (event) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <motion.div
        animate={pulse ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            color: isOpen ? '#0D5C3F' : '#636E72',
            '&:hover': {
              backgroundColor: 'rgba(13, 92, 63, 0.05)',
            },
          }}
          aria-label={`${unreadCount} unread notifications`}
          aria-expanded={isOpen}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.75rem',
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </motion.div>

      {/* Desktop: Dropdown Menu */}
      {!isMobile && (
        <NotificationDropdown
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        />
      )}

      {/* Mobile: Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: 400,
            },
          }}
        >
          <NotificationDropdown
            anchorEl={null}
            open={drawerOpen}
            onClose={handleClose}
            isMobile={true}
          />
        </Drawer>
      )}
    </>
  );
}

export default NotificationBell;
