// Live Session WebSocket Service
// Real-time session updates via WebSocket
// Following Phoenix pattern

import { getFromLS } from '../../funcs/LSFuncs';
import { LS_CONSTS } from '../../constants/LSConstants';
import { SESSION_WS_CONFIG, SESSION_WS_MESSAGE_TYPES } from '../../constants/LiveSessionConstants';

/**
 * LiveSessionWebSocketService
 * Manages WebSocket connection for a specific live session
 */
class LiveSessionWebSocketService {
  constructor() {
    this.ws = null;
    this.sessionId = null;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.isConnecting = false;
    this.isManualDisconnect = false;

    // Callbacks
    this.messageHandlers = {};
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
    this.onErrorCallback = null;
  }

  /**
   * Get WebSocket URL for session
   */
  getWebSocketUrl(sessionId) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
    const wsURL = baseURL.replace('http', 'ws');
    const token = getFromLS(LS_CONSTS.LS_ACCESS_TOKEN);

    if (!token) {
      console.error('No access token found for session WebSocket');
      return null;
    }

    return `${wsURL}/live-sessions/${sessionId}/ws?token=${token}`;
  }

  /**
   * Connect to session WebSocket
   */
  connect(sessionId, handlers = {}) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log('Session WebSocket already connected or connecting');
      return;
    }

    this.sessionId = sessionId;
    this.isConnecting = true;
    this.isManualDisconnect = false;

    // Set handlers
    this.messageHandlers = handlers;
    this.onConnectCallback = handlers.onConnect;
    this.onDisconnectCallback = handlers.onDisconnect;
    this.onErrorCallback = handlers.onError;

    const wsUrl = this.getWebSocketUrl(sessionId);
    if (!wsUrl) {
      this.isConnecting = false;
      this.onErrorCallback?.('No access token available');
      return;
    }

    try {
      console.log('Connecting to session WebSocket:', wsUrl.replace(/token=[^&]*/, 'token=***'));
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onerror = (error) => this.handleError(error);
      this.ws.onclose = (event) => this.handleClose(event);

    } catch (error) {
      console.error('Session WebSocket connection error:', error);
      this.isConnecting = false;
      this.onErrorCallback?.(error);
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket open
   */
  handleOpen() {
    console.log(`✅ Session WebSocket connected (Session: ${this.sessionId})`);
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.onConnectCallback?.();
  }

  /**
   * Handle incoming message
   */
  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      const messageType = message.type;

      // Call specific handler for this message type
      switch (messageType) {
        case SESSION_WS_MESSAGE_TYPES.SESSION_STARTED:
          this.messageHandlers.onSessionStarted?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.QUESTION_REVEALED:
          this.messageHandlers.onQuestionRevealed?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.TIMER_UPDATE:
          this.messageHandlers.onTimerUpdate?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.WHOLE_QUIZ_TIMER_UPDATE:
          this.messageHandlers.onWholeQuizTimerUpdate?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.QUESTION_AUTO_ADVANCE:
          this.messageHandlers.onQuestionAdvance?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.LEADERBOARD_UPDATE:
          this.messageHandlers.onLeaderboardUpdate?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.SESSION_ENDED:
          this.messageHandlers.onSessionEnded?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.PARTICIPANT_JOINED:
          this.messageHandlers.onParticipantJoined?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.PARTICIPANT_LEFT:
          this.messageHandlers.onParticipantLeft?.(message.data);
          break;

        case SESSION_WS_MESSAGE_TYPES.ERROR:
          console.error('Session WebSocket server error:', message.data);
          this.onErrorCallback?.(message.data);
          break;

        default:
          console.log('Unknown session WebSocket message type:', messageType);
      }
    } catch (error) {
      console.error('Error parsing session WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket error
   */
  handleError(error) {
    console.error('Session WebSocket error:', error);
    this.onErrorCallback?.(error);
  }

  /**
   * Handle WebSocket close
   */
  handleClose(event) {
    console.log(`Session WebSocket disconnected (Session: ${this.sessionId}):`, event.code, event.reason);
    this.isConnecting = false;
    this.onDisconnectCallback?.();

    // Only attempt reconnect if not manually disconnected and not normal closure
    if (!this.isManualDisconnect && event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  scheduleReconnect() {
    if (this.isManualDisconnect) {
      return;
    }

    if (this.reconnectAttempts >= SESSION_WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.error('Max session WebSocket reconnection attempts reached');
      this.onErrorCallback?.('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;

    const delay = Math.min(
      SESSION_WS_CONFIG.RECONNECT_DELAY_BASE * Math.pow(2, this.reconnectAttempts - 1),
      SESSION_WS_CONFIG.RECONNECT_DELAY_MAX
    );

    console.log(`Reconnecting session WebSocket in ${delay}ms... (attempt ${this.reconnectAttempts}/${SESSION_WS_CONFIG.MAX_RECONNECT_ATTEMPTS})`);

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect session WebSocket...');
      this.connect(this.sessionId, {
        ...this.messageHandlers,
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

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, 'Manual disconnect');
      }
      this.ws = null;
    }

    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.sessionId = null;
    console.log('Session WebSocket manually disconnected');
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Send message through WebSocket
   */
  send(message) {
    if (this.isConnected()) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message: Session WebSocket not connected');
    }
  }
}

// Export singleton instance
const liveSessionWebSocketService = new LiveSessionWebSocketService();
export default liveSessionWebSocketService;
