// Live Session Context Provider
// Global state management for live sessions with WebSocket support
// Following Phoenix pattern

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useNetReq from "../../hooks/NetworkRequest";
import {
  createLiveSession,
  getLiveSession,
  getMySessions,
  getPublicSessions,
  startLiveSession,
  advanceQuestion,
  endLiveSession,
  joinLiveSession,
  submitAnswer,
  leaveLiveSession,
  getSessionLeaderboard,
  getSessionResults,
  inviteUsers,
  getMyInvitations,
} from "../../services/liveSession/LiveSessionServices";
import liveSessionWebSocketService from "../../services/liveSession/LiveSessionWebSocketService";
import { SESSION_STATUS } from "../../constants/LiveSessionConstants";
import { ROUTES, buildRoute } from "../../constants/RouteConstants";

const LiveSessionCtx = createContext();

/**
 * Live Session Context Provider
 * Manages live session state, gameplay, and real-time updates
 */
function LiveSessionContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const navigate = useNavigate();
  const abortContRef = useRef(null);

  // Current session state
  const [currentSession, setCurrentSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myScore, setMyScore] = useState(0);
  const [myRank, setMyRank] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Lists state
  const [publicSessions, setPublicSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [invitations, setInvitations] = useState([]);

  // Loading & connection state
  const [isLoading, setIsLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  /**
   * Create a new session
   */
  const handleCreateSession = useCallback(
    async (sessionData) => {
      setIsLoading(true);
      const response = await createLiveSession(fetchData, abortContRef, {
        sessionData,
      });
      setIsLoading(false);

      if (response.success) {
        const session = response.data?.data || response.data;
        setCurrentSession(session);
        return { success: true, session };
      }

      return response;
    },
    [fetchData],
  );

  /**
   * Fetch session details
   */
  const handleGetSession = useCallback(
    async (sessionId) => {
      setIsLoading(true);
      const response = await getLiveSession(fetchData, abortContRef, {
        sessionId,
      });
      setIsLoading(false);

      if (response.success) {
        const session = response.data?.data || response.data;
        setCurrentSession(session);
        return { success: true, session };
      }

      return response;
    },
    [fetchData],
  );

  /**
   * Fetch public sessions
   */
  const handleGetPublicSessions = useCallback(
    async (params = {}) => {
      setIsLoading(true);
      const response = await getPublicSessions(fetchData, abortContRef, params);
      setIsLoading(false);

      if (response.success) {
        const data = response.data?.data || response.data;
        setPublicSessions(data.sessions || []);
      }

      return response;
    },
    [fetchData],
  );

  /**
   * Fetch my sessions
   */
  const handleGetMySessions = useCallback(
    async (params = {}) => {
      setIsLoading(true);
      const response = await getMySessions(fetchData, abortContRef, params);
      setIsLoading(false);

      if (response.success) {
        const data = response.data?.data || response.data;
        setMySessions(data.sessions || []);
      }

      return response;
    },
    [fetchData],
  );

  /**
   * Fetch my invitations
   */
  const handleGetInvitations = useCallback(async () => {
    setIsLoading(true);
    const response = await getMyInvitations(fetchData, abortContRef);
    setIsLoading(false);

    if (response.success) {
      const data = response.data?.data || response.data;
      setInvitations(data.invitations || []);
    }

    return response;
  }, [fetchData]);

  /**
   * Start a session
   */
  const handleStartSession = useCallback(
    async (sessionId) => {
      setIsLoading(true);
      const response = await startLiveSession(fetchData, abortContRef, {
        sessionId,
      });
      setIsLoading(false);

      if (response.success) {
        // Session started - WebSocket will notify participants
      }

      return response;
    },
    [fetchData],
  );

  /**
   * Join a session
   */
  const handleJoinSession = useCallback(
    async (sessionId, accessCode = null) => {
      setIsLoading(true);
      const response = await joinLiveSession(fetchData, abortContRef, {
        sessionId,
        accessCode,
      });
      setIsLoading(false);

      if (response.success) {
        const data = response.data?.data || response.data;
        const participant = data.participant || data;

        // Connect to WebSocket for real-time updates
        connectToSession(sessionId);

        // Fetch session details
        await handleGetSession(sessionId);

        return { success: true, participant };
      }

      return response;
    },
    [fetchData],
  );

  /**
   * Submit an answer
   */
  const handleSubmitAnswer = useCallback(
    async (sessionId, questionId, answerId, timeTakenMs) => {
      if (hasAnswered) {
        toast.error("You already answered this question");
        return { success: false, error: "Already answered" };
      }

      const response = await submitAnswer(fetchData, abortContRef, {
        sessionId,
        answerData: {
          question_id: questionId,
          answer_id: answerId,
          time_taken_ms: timeTakenMs,
        },
      });

      if (response.success) {
        const data = response.data?.data || response.data;
        setHasAnswered(true);
        setMyScore(data.total_score || 0);
        setMyRank(data.current_rank);

        // Show feedback
        if (data.is_correct) {
          toast.success(`Correct! +${data.points_earned} points`, {
            icon: "✅",
            duration: 3000,
          });
        } else {
          toast.error("Wrong answer", {
            icon: "❌",
            duration: 3000,
          });
        }

        return { success: true, result: data };
      } else {
        toast.error(response.error?.message || "Failed to submit answer");
      }

      return response;
    },
    [fetchData, hasAnswered],
  );

  /**
   * Leave session
   */
  const handleLeaveSession = useCallback(
    async (sessionId) => {
      await leaveLiveSession(fetchData, abortContRef, { sessionId });
      disconnectFromSession();
      setCurrentSession(null);
      setCurrentQuestion(null);
      navigate(ROUTES.LIVE_SESSIONS);
    },
    [fetchData, navigate],
  );

  /**
   * End session (host only)
   */
  const handleEndSession = useCallback(
    async (sessionId) => {
      const response = await endLiveSession(fetchData, abortContRef, {
        sessionId,
      });
      return response;
    },
    [fetchData],
  );

  /**
   * Fetch leaderboard
   */
  const handleGetLeaderboard = useCallback(
    async (sessionId) => {
      const response = await getSessionLeaderboard(fetchData, abortContRef, {
        sessionId,
      });

      if (response.success) {
        const data = response.data?.data || response.data;
        setLeaderboard(data.leaderboard || []);
        setMyScore(data.my_score || 0);
        setMyRank(data.my_rank);
      }

      return response;
    },
    [fetchData],
  );

  /**
   * Fetch results
   */
  const handleGetResults = useCallback(
    async (sessionId) => {
      const response = await getSessionResults(fetchData, abortContRef, {
        sessionId,
      });
      return response;
    },
    [fetchData],
  );

  /**
   * Connect to session WebSocket
   */
  const connectToSession = useCallback(
    (sessionId) => {
      liveSessionWebSocketService.connect(sessionId, {
        onSessionStarted: (data) => {
          console.log("Session started:", data);
          setCurrentQuestion(data.first_question);
          setTimeRemaining(data.first_question?.timer_seconds || 30);
          setHasAnswered(false);
          navigate(buildRoute(ROUTES.LIVE_SESSION_LIVE, { id: sessionId }));
        },

        onQuestionRevealed: (data) => {
          console.log("Question revealed:", data);
          setCurrentQuestion(data.question);
          setTimeRemaining(data.timer_seconds);
          setHasAnswered(false);
        },

        onTimerUpdate: (data) => {
          setTimeRemaining(data.seconds_remaining);
        },

        onWholeQuizTimerUpdate: (data) => {
          setTimeRemaining(data.seconds_remaining);
        },

        onQuestionAdvance: (data) => {
          console.log("Auto-advancing to next question:", data);
          setCurrentQuestion(data.next_question);
          setTimeRemaining(data.next_question?.timer_seconds || 30);
          setHasAnswered(false);
        },

        onLeaderboardUpdate: (data) => {
          setLeaderboard(data.leaderboard || []);
        },

        onSessionEnded: (data) => {
          console.log("Session ended:", data);
          toast.success("Session completed!");
          navigate(buildRoute(ROUTES.LIVE_SESSION_RESULTS, { id: sessionId }));
        },

        onParticipantJoined: (data) => {
          setParticipants((prev) => [...prev, data]);
          toast(`${data.user_name} joined!`, { icon: "👋", duration: 2000 });
        },

        onConnect: () => {
          console.log("Connected to session WebSocket");
          setWsConnected(true);
        },

        onDisconnect: () => {
          console.log("Disconnected from session WebSocket");
          setWsConnected(false);
        },

        onError: (error) => {
          console.error("Session WebSocket error:", error);
          toast.error("Connection error");
        },
      });
    },
    [navigate],
  );

  /**
   * Disconnect from session WebSocket
   */
  const disconnectFromSession = useCallback(() => {
    liveSessionWebSocketService.disconnect();
    setWsConnected(false);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      disconnectFromSession();
      if (abortContRef.current) {
        abortContRef.current.abort();
      }
    };
  }, [disconnectFromSession]);

  const value = {
    // Current session state
    currentSession,
    currentQuestion,
    timeRemaining,
    participants,
    leaderboard,
    myScore,
    myRank,
    hasAnswered,
    wsConnected,

    // Lists
    publicSessions,
    mySessions,
    invitations,

    // Loading
    isLoading,

    // Actions
    createSession: handleCreateSession,
    getSession: handleGetSession,
    getPublicSessions: handleGetPublicSessions,
    getMySessions: handleGetMySessions,
    getMyInvitations: handleGetInvitations,
    startSession: handleStartSession,
    joinSession: handleJoinSession,
    submitAnswer: handleSubmitAnswer,
    leaveSession: handleLeaveSession,
    endSession: handleEndSession,
    getLeaderboard: handleGetLeaderboard,
    getResults: handleGetResults,
    connectToSession,
    disconnectFromSession,
  };

  return (
    <LiveSessionCtx.Provider value={value}>{children}</LiveSessionCtx.Provider>
  );
}

LiveSessionContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use Live Session Context
 */
export const useLiveSession = () => {
  const context = useContext(LiveSessionCtx);
  if (!context) {
    throw new Error(
      "useLiveSession must be used within LiveSessionContextProvider",
    );
  }
  return context;
};

export default LiveSessionContextProvider;
