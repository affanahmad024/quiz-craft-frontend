// Notification WebSocket Service
// Real-time notification delivery via WebSocket
// Following Phoenix pattern

import { getFromLS } from '../../funcs/LSFuncs';
import { LS_CONSTS } from '../../constants/LSConstants';
import { NOTIFICATION_WS_CONFIG, WS_MESSAGE_TYPES } from '../../constants/NotificationConstants';

/**
 * NotificationWebSocketService
 * Manages WebSocket connection for real-time notifications
 */
class NotificationWebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.isConnecting = false;
    this.isManualDisconnect = false;

    // Callbacks
    this.onMessageCallback = null;
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
    this.onErrorCallback = null;
  }

  /**
   * Get WebSocket URL
   */
  getWebSocketUrl() {
    const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');
    const apiBaseURL = baseURL.endsWith('/api/v1') ? baseURL : baseURL + '/api/v1';
    const wsURL = apiBaseURL.replace(/^http/, 'ws'); // Convert http(s) to ws(s)
    const token = getFromLS(LS_CONSTS.LS_ACCESS_TOKEN);

    if (!token) {
      console.error('No access token found for WebSocket connection');
      return null;
    }

    return `${wsURL}/notifications/ws?token=${token}`;
  }

  /**
   * Connect to WebSocket
   */
  connect(callbacks = {}) {
    // Don't connect if already connected or connecting
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    this.isManualDisconnect = false;

    // Set callbacks
    this.onMessageCallback = callbacks.onMessage;
    this.onConnectCallback = callbacks.onConnect;
    this.onDisconnectCallback = callbacks.onDisconnect;
    this.onErrorCallback = callbacks.onError;

    const wsUrl = this.getWebSocketUrl();
    if (!wsUrl) {
      this.isConnecting = false;
      this.onErrorCallback?.('No access token available');
      return;
    }

    try {
      console.log('Connecting to WebSocket:', wsUrl.replace(/token=[^&]*/, 'token=***'));
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onerror = (error) => this.handleError(error);
      this.ws.onclose = (event) => this.handleClose(event);

    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      this.onErrorCallback?.(error);
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket open
   */
  handleOpen() {
    console.log('✅ WebSocket connected successfully');
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    // Clear any pending reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.onConnectCallback?.();
  }

  /**
   * Handle incoming WebSocket message
   */
  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);

      // Handle different message types
      switch (message.type) {
        case WS_MESSAGE_TYPES.NOTIFICATION:
          // New notification received
          this.onMessageCallback?.(message.data);
          break;

        case WS_MESSAGE_TYPES.CONNECTED:
          console.log('WebSocket handshake confirmed');
          break;

        case WS_MESSAGE_TYPES.ERROR:
          console.error('WebSocket server error:', message.data);
          this.onErrorCallback?.(message.data);
          break;

        default:
          console.log('Unknown WebSocket message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket error
   */
  handleError(error) {
    console.error('WebSocket error:', error);
    this.onErrorCallback?.(error);
  }

  /**
   * Handle WebSocket close
   */
  handleClose(event) {
    console.log('WebSocket disconnected:', event.code, event.reason);
    this.isConnecting = false;
    this.onDisconnectCallback?.();

    // Only attempt reconnect if not manually disconnected
    if (!this.isManualDisconnect) {
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  scheduleReconnect() {
    // Don't reconnect if manual disconnect or max attempts reached
    if (this.isManualDisconnect) {
      return;
    }

    if (this.reconnectAttempts >= NOTIFICATION_WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.error('Max WebSocket reconnection attempts reached');
      this.onErrorCallback?.('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;

    // Calculate delay with exponential backoff
    const delay = Math.min(
      NOTIFICATION_WS_CONFIG.RECONNECT_DELAY_BASE * Math.pow(2, this.reconnectAttempts - 1),
      NOTIFICATION_WS_CONFIG.RECONNECT_DELAY_MAX
    );

    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${NOTIFICATION_WS_CONFIG.MAX_RECONNECT_ATTEMPTS})`);

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      this.connect({
        onMessage: this.onMessageCallback,
        onConnect: this.onConnectCallback,
        onDisconnect: this.onDisconnectCallback,
        onError: this.onErrorCallback,
      });
    }, delay);
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    this.isManualDisconnect = true;

    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Close WebSocket
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, 'Manual disconnect');
      }
      this.ws = null;
    }

    this.isConnecting = false;
    this.reconnectAttempts = 0;
    console.log('WebSocket manually disconnected');
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Send message through WebSocket
   * (Not used for notifications, but available if needed)
   */
  send(message) {
    if (this.isConnected()) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  }
}

// Export singleton instance
const notificationWebSocketService = new NotificationWebSocketService();
export default notificationWebSocketService;
