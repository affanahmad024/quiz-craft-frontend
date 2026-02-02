// Notification Context Provider
// Global state management for notifications with WebSocket support
// Following Phoenix pattern

import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import useNetReq from '../../hooks/NetworkRequest';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../../services/notifications/NotificationServices';
import notificationWebSocketService from '../../services/notifications/NotificationWebSocketService';
import { NOTIFICATION_SETTINGS } from '../../constants/NotificationConstants';
import { useAuth } from '../auth/AuthContextProvider';

const NotificationCtx = createContext();

/**
 * Notification Context Provider
 * Manages notification state, real-time updates via WebSocket
 */
function NotificationContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const { isAuthenticated } = useAuth();
  const abortContRef = useRef(null);

  // State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async (params = {}) => {
    setIsLoading(true);
    const response = await getNotifications(fetchData, abortContRef, {
      limit: params.limit || NOTIFICATION_SETTINGS.PAGE_SIZE,
      offset: params.offset || 0,
      type: params.type,
      unread_only: params.unread_only,
    });
    setIsLoading(false);

    if (response.success) {
      const data = response.data?.data || response.data;
      const newNotifications = data.notifications || [];
      const total = data.total || 0;

      // If offset is 0, replace all notifications (refresh)
      if (params.offset === 0) {
        setNotifications(newNotifications);
      } else {
        // Otherwise, append to existing (pagination)
        setNotifications(prev => [...prev, ...newNotifications]);
      }

      // Check if there are more notifications
      const currentTotal = (params.offset || 0) + newNotifications.length;
      setHasMore(currentTotal < total);
    }

    return response;
  }, [fetchData]);

  /**
   * Fetch unread count
   */
  const fetchUnreadCount = useCallback(async () => {
    const response = await getUnreadCount(fetchData, abortContRef);

    if (response.success) {
      const data = response.data?.data || response.data;
      setUnreadCount(data.count || 0);
    }

    return response;
  }, [fetchData]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (notificationId) => {
    const response = await markNotificationAsRead(fetchData, abortContRef, {
      notificationId,
    });

    if (response.success) {
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true, read_at: new Date().toISOString() } : notif
        )
      );

      // Decrease unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    return response;
  }, [fetchData]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    const response = await markAllNotificationsAsRead(fetchData, abortContRef);

    if (response.success) {
      // Update all notifications in local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() }))
      );

      // Reset unread count
      setUnreadCount(0);
    }

    return response;
  }, [fetchData]);

  /**
   * Delete notification
   */
  const removeNotification = useCallback(async (notificationId) => {
    const response = await deleteNotification(fetchData, abortContRef, {
      notificationId,
    });

    if (response.success) {
      // Remove from local state
      setNotifications(prev => {
        const deletedNotif = prev.find(n => n.id === notificationId);
        const newNotifications = prev.filter(n => n.id !== notificationId);

        // If the deleted notification was unread, decrease count
        if (deletedNotif && !deletedNotif.is_read) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }

        return newNotifications;
      });
    }

    return response;
  }, [fetchData]);

  /**
   * Load more notifications (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const nextPage = currentPage + 1;
    const offset = nextPage * NOTIFICATION_SETTINGS.PAGE_SIZE;

    await fetchNotifications({ offset });
    setCurrentPage(nextPage);
  }, [currentPage, hasMore, isLoading, fetchNotifications]);

  /**
   * Refresh notifications (from start)
   */
  const refresh = useCallback(async () => {
    setCurrentPage(0);
    await Promise.all([
      fetchNotifications({ offset: 0 }),
      fetchUnreadCount(),
    ]);
  }, [fetchNotifications, fetchUnreadCount]);

  /**
   * Handle new notification from WebSocket
   */
  const handleNewNotification = useCallback((notification) => {
    // Add new notification to the top
    setNotifications(prev => [notification, ...prev]);

    // Increase unread count
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast(notification.title, {
      icon: '🔔',
      duration: NOTIFICATION_SETTINGS.TOAST_DURATION,
      position: 'bottom-right',
    });
  }, []);

  /**
   * Connect to WebSocket
   */
  const connectWebSocket = useCallback(() => {
    if (!isAuthenticated) {
      console.log('Cannot connect to WebSocket: User not authenticated');
      return;
    }

    notificationWebSocketService.connect({
      onMessage: (notification) => {
        handleNewNotification(notification);
      },
      onConnect: () => {
        console.log('Notification WebSocket connected');
        setWsConnected(true);
      },
      onDisconnect: () => {
        console.log('Notification WebSocket disconnected');
        setWsConnected(false);
      },
      onError: (error) => {
        console.error('Notification WebSocket error:', error);
        setWsConnected(false);
      },
    });
  }, [isAuthenticated, handleNewNotification]);

  /**
   * Disconnect from WebSocket
   */
  const disconnectWebSocket = useCallback(() => {
    notificationWebSocketService.disconnect();
    setWsConnected(false);
  }, []);

  /**
   * Initialize notifications on mount
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Don't auto-fetch notifications - they'll be loaded when user opens the bell
    }
  }, [isAuthenticated, fetchUnreadCount]);

  /**
   * Connect/disconnect WebSocket based on authentication
   */
  useEffect(() => {
    if (isAuthenticated) {
      // Connect to WebSocket when user is authenticated
      connectWebSocket();
    } else {
      // Disconnect when user logs out
      disconnectWebSocket();
    }
  }, [isAuthenticated, connectWebSocket, disconnectWebSocket]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      disconnectWebSocket();
      if (abortContRef.current) {
        abortContRef.current.abort();
      }
    };
  }, [disconnectWebSocket]);

  const value = {
    // State
    notifications,
    unreadCount,
    isLoading,
    wsConnected,
    hasMore,

    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    loadMore,
    refresh,
    handleNewNotification,
    connectWebSocket,
    disconnectWebSocket,
  };

  return <NotificationCtx.Provider value={value}>{children}</NotificationCtx.Provider>;
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use Notification Context
 */
export const useNotifications = () => {
  const context = useContext(NotificationCtx);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationContextProvider');
  }
  return context;
};

export default NotificationContextProvider;
