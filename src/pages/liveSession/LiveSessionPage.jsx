import { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, Button, Paper, LinearProgress, Chip, IconButton } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";
import { getLiveSessionQuestions } from "../../services/liveSession/LiveSessionServices";
import { getQuizFull } from "../../services/quiz/QuizServices";
import useNetReq from "../../hooks/NetworkRequest";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, buildRoute } from "../../constants/RouteConstants";
import toast from "react-hot-toast";

const getRemainingSeconds = (session) => {
  if (!session) return 0;

  const timerMode = session.timer_mode;
  const startedAt =
    timerMode === "whole_quiz"
      ? session.quiz_started_at
      : session.current_question_started_at;
  const totalSeconds =
    timerMode === "whole_quiz"
      ? session.whole_quiz_timer_seconds
      : session.question_timer_seconds;

  if (!startedAt || !totalSeconds) {
    return totalSeconds || 0;
  }

  const parsedStart = new Date(startedAt).getTime();
  if (Number.isNaN(parsedStart)) {
    return totalSeconds;
  }

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - parsedStart) / 1000));
  const remainingSeconds = totalSeconds - elapsedSeconds;
  return Math.min(totalSeconds, Math.max(0, remainingSeconds));
};

const getQuestionAnswers = (question) => {
  if (!question) return [];

  const answers =
    question.answers ||
    question.options ||
    question.choices ||
    question.meta?.answers ||
    question.meta?.options ||
    question.meta?.choices ||
    [];
  if (!Array.isArray(answers)) return [];

  return answers.map((answer, index) => {
    if (typeof answer === "string") {
      return {
        id: `${question.id || "question"}-${index}`,
        answer_text: answer,
      };
    }

    return {
      ...answer,
      id: answer.id || answer.answer_id || `${question.id || "question"}-${index}`,
      answer_text: answer.answer_text || answer.label || answer.text || answer.option || "",
    };
  });
};

function LiveSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getSession,
    currentSession,
    currentQuestion,
    timeRemaining,
    submitAnswer,
    hasAnswered,
    leaderboard,
    getLeaderboard,
    connectToSession,
  } = useLiveSession();

  const { fetchData } = useNetReq();
  const questionsAbortRef = useRef(null);
  const quizFallbackAbortRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState({});
  const [isWholeQuizMode, setIsWholeQuizMode] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [localTimeRemaining, setLocalTimeRemaining] = useState(0);

  // Load session and check timer mode
  useEffect(() => {
    const load = async () => {
      const response = await getSession(id);
      const session = response?.session || response?.data?.data || response?.data;
      if (session) {
        setLocalTimeRemaining(getRemainingSeconds(session));
        setCurrentQuestionIndex(session.current_question_index || 0);
      }
      await getLeaderboard(id).catch(() => {});
      connectToSession(id);
    };
    load();
  }, [id, getSession, getLeaderboard, connectToSession]);

  // Check timer mode when currentSession updates
  useEffect(() => {
    if (currentSession) {
      const wholeQuizMode = currentSession.timer_mode === "whole_quiz";
      setIsWholeQuizMode(wholeQuizMode);
      setCurrentQuestionIndex(currentSession.current_question_index || 0);
      setLocalTimeRemaining(getRemainingSeconds(currentSession));

      loadSessionQuestions();
    }
  }, [currentSession, fetchData, id]);

  const loadSessionQuestions = async () => {
    const response = await getLiveSessionQuestions(fetchData, questionsAbortRef, { sessionId: id });
    const data = response.data?.data || response.data;
    const questions = data?.questions || [];

    if (response.success && questions.some((question) => getQuestionAnswers(question).length > 0)) {
      setSessionQuestions(questions);
      return;
    }

    if (!currentSession?.quiz_id) {
      setSessionQuestions(questions);
      return;
    }

    const fallback = await getQuizFull(fetchData, quizFallbackAbortRef, {
      quizId: currentSession.quiz_id,
      hideCorrect: true,
    });
    const fallbackData = fallback.data?.data || fallback.data;
    setSessionQuestions(fallbackData?.questions || questions);
  };

  useEffect(() => {
    if (Number.isFinite(timeRemaining)) {
      const total = Number(
        (currentSession?.timer_mode === "whole_quiz"
          ? currentSession?.whole_quiz_timer_seconds
          : currentSession?.question_timer_seconds) ||
          timeRemaining ||
          0,
      );
      setLocalTimeRemaining(Math.min(total, Math.max(0, timeRemaining)));
    }
  }, [
    currentSession?.question_timer_seconds,
    currentSession?.timer_mode,
    currentSession?.whole_quiz_timer_seconds,
    timeRemaining,
  ]);

  useEffect(() => {
    if (currentSession?.status !== "live" || localTimeRemaining <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setLocalTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentSession?.status, localTimeRemaining]);

  useEffect(() => {
    if (currentSession?.status !== "live" || localTimeRemaining !== 0) {
      return undefined;
    }

    const timer = setTimeout(async () => {
      await submitDueAnswers();

      const response = await getSession(id);
      const session = response?.session || response?.data?.data || response?.data;

      if (session?.status === "completed") {
        navigate(buildRoute(ROUTES.LIVE_SESSION_RESULTS, { id }), { replace: true });
        return;
      }

      if (session) {
        setCurrentQuestionIndex(session.current_question_index || 0);
        setLocalTimeRemaining(getRemainingSeconds(session));
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentSession?.status, getSession, id, localTimeRemaining, navigate]);

  useEffect(() => {
    if (currentSession?.status === "completed") {
      navigate(buildRoute(ROUTES.LIVE_SESSION_RESULTS, { id }), { replace: true });
    }
  }, [currentSession?.status, id, navigate]);

  // For whole-quiz mode, get current question from quiz
  const getCurrentQuestion = () => {
    if (isWholeQuizMode && sessionQuestions?.length) {
      return sessionQuestions[Math.min(currentQuestionIndex, sessionQuestions.length - 1)];
    }
    if (getQuestionAnswers(currentQuestion).length > 0) {
      return currentQuestion;
    }
    const sessionIndex = currentSession?.current_question_index || currentQuestionIndex;
    return sessionQuestions[Math.min(sessionIndex, Math.max(sessionQuestions.length - 1, 0))] || currentQuestion;
  };

  const activeQuestion = getCurrentQuestion();
  const answerOptions = getQuestionAnswers(activeQuestion);
  const questionText = activeQuestion?.question_text || activeQuestion?.text || "";
  const timerTotal =
    currentSession?.timer_mode === "whole_quiz"
      ? currentSession?.whole_quiz_timer_seconds
      : currentSession?.question_timer_seconds;
  const lowTimeThreshold = timerTotal
    ? Math.max(5, Math.floor(Number(timerTotal) * 0.15))
    : 10;
  const progressValue = timerTotal
    ? Math.min(100, Math.max(0, ((timerTotal - localTimeRemaining) / timerTotal) * 100))
    : 0;
  const activeQuestionAnswered = isWholeQuizMode
    ? !!submittedQuestions[activeQuestion?.id]
    : !!submittedQuestions[activeQuestion?.id] || hasAnswered;
  const activeSelectedAnswer = selectedAnswers[activeQuestion?.id];

  useEffect(() => {
    if (currentSession?.status !== "live" || activeQuestion || sessionQuestions.length > 0) {
      return undefined;
    }

    const retry = setTimeout(() => {
      loadSessionQuestions();
      getSession(id);
    }, 1000);

    return () => clearTimeout(retry);
  }, [activeQuestion, currentSession?.status, getSession, id, sessionQuestions.length]);

  const submitQuestionAnswer = async (question) => {
    if (!question?.id || submittedQuestions[question.id]) return;
    setSubmitting(true);

    const answerId = selectedAnswers[question.id] || null;
    const timeTakenMs = isWholeQuizMode
      ? 0
      : Math.max(
          0,
          (question.timer_seconds ||
            currentSession?.question_timer_seconds ||
            0) - (localTimeRemaining || 0),
        ) * 1000;

    const response = await submitAnswer(id, question.id, answerId, timeTakenMs).catch(
      () => ({ success: false }),
    );

    if (response.success || response.error?.message === "already-answered") {
      setSubmittedQuestions((prev) => ({
        ...prev,
        [question.id]: true,
      }));
    }

    setSubmitting(false);
    getLeaderboard(id).catch(() => {});
  };

  const submitDueAnswers = async () => {
    if (isWholeQuizMode) {
      for (const question of sessionQuestions) {
        if (selectedAnswers[question.id] && !submittedQuestions[question.id]) {
          // eslint-disable-next-line no-await-in-loop
          await submitQuestionAnswer(question);
        }
      }
      return;
    }

    await submitQuestionAnswer(activeQuestion);
  };

  const handleAnswer = (answerId) => {
    if (!activeQuestion?.id || activeQuestionAnswered || localTimeRemaining <= 0) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: answerId,
    }));
  };

  // Navigation handlers for whole-quiz mode
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (sessionQuestions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerDisplay = () => {
    const timerMode = currentSession?.timer_mode;

    if (timerMode === "whole_quiz") {
      return (
        <>
          <Typography variant="subtitle1">Quiz Time Remaining</Typography>
          <Typography variant="h4" sx={{ my: 1, color: localTimeRemaining <= lowTimeThreshold ? "error.main" : "inherit" }}>
            {formatTime(localTimeRemaining)}
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <Typography variant="subtitle1">Question Time</Typography>
          <Typography variant="h4" sx={{ my: 1, color: localTimeRemaining < 10 ? "error.main" : "inherit" }}>
            {localTimeRemaining}s
          </Typography>
        </>
      );
    }
  };

  // Get question status for palette
  const getQuestionStatus = (question, index) => {
    if (submittedQuestions[question.id]) {
      return "answered";
    } else if (selectedAnswers[question.id]) {
      return "selected";
    } else if (index === currentQuestionIndex) {
      return "current";
    } else {
      return "not-answered";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "success";
      case "selected":
        return "warning";
      case "current":
        return "primary";
      default:
        return "default";
    }
  };

  if (!activeQuestion) {
    return (
      <AnimatedPage>
        <Container sx={{ py: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Waiting for question...
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Reconnecting to the live session and loading the current question.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={loadSessionQuestions}>
                Retry
              </Button>
              <Button variant="outlined" onClick={() => getSession(id)}>
                Refresh Session
              </Button>
            </Box>
          </Paper>
        </Container>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 320px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box>
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2 }}>
                <Typography variant="h6">
                  Question{" "}
                  {isWholeQuizMode
                    ? currentQuestionIndex + 1
                    : activeQuestion?.position || activeQuestion?.order_index + 1 || ""}
                  {isWholeQuizMode && ` of ${sessionQuestions?.length || 0}`}
                </Typography>
                <Chip
                  size="small"
                  color={activeQuestionAnswered ? "success" : activeSelectedAnswer ? "warning" : "primary"}
                  label={activeQuestionAnswered ? "Submitted" : activeSelectedAnswer ? "Selected" : "Open"}
                />
                {isWholeQuizMode && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      size="small"
                    >
                      <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                      onClick={handleNext}
                      disabled={currentQuestionIndex >= (sessionQuestions?.length || 0) - 1}
                      size="small"
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Typography
                variant="h5"
                sx={{
                  my: { xs: 2, md: 3 },
                  lineHeight: 1.35,
                  fontWeight: 700,
                  fontSize: { xs: "1.25rem", md: "1.45rem" },
                }}
              >
                {questionText}
              </Typography>

              <Box sx={{ display: "grid", gap: 1.25 }}>
                {answerOptions.length === 0 && (
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography color="text.secondary">Loading answer choices...</Typography>
                  </Paper>
                )}

                {answerOptions.map((opt, index) => {
                  const isAnswered = activeQuestionAnswered;
                  const isSelected = activeSelectedAnswer === opt.id;
                  const label = opt.answer_text || opt.label || opt.text;
                  const optionLetter = String.fromCharCode(65 + index);

                  return (
                    <Button
                      key={opt.id}
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleAnswer(opt.id)}
                      disabled={isAnswered || submitting || localTimeRemaining <= 0}
                      sx={{
                        textTransform: "none",
                        justifyContent: "flex-start",
                        textAlign: "left",
                        minHeight: 60,
                        px: { xs: 1.5, md: 2 },
                        borderRadius: 2,
                        bgcolor: isSelected ? "#0f766e" : "background.paper",
                        color: isSelected ? "white" : "text.primary",
                        border: "1px solid",
                        borderColor: isSelected ? "#0f766e" : "divider",
                        boxShadow: isSelected ? "0 8px 18px rgba(15, 118, 110, 0.18)" : "none",
                        "&:hover": {
                          borderColor: "#0f766e",
                          bgcolor: isSelected ? "#115e59" : "action.hover",
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 30,
                          height: 30,
                          mr: 1.5,
                          borderRadius: "50%",
                          bgcolor: isSelected ? "rgba(255,255,255,0.18)" : "action.hover",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {optionLetter}
                      </Box>
                      <Box component="span" sx={{ fontSize: "0.98rem", fontWeight: 600, lineHeight: 1.35 }}>
                        {label}
                      </Box>
                    </Button>
                  );
                })}
              </Box>

              {isWholeQuizMode && (
                <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleNext}
                    disabled={currentQuestionIndex >= (sessionQuestions?.length || 0) - 1}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>

          <Box sx={{ display: "grid", gap: 2, position: { lg: "sticky" }, top: { lg: 88 } }}>
            <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              {getTimerDisplay()}
              <LinearProgress
                variant="determinate"
                value={progressValue}
                color={localTimeRemaining <= lowTimeThreshold ? "error" : "primary"}
                sx={{ mt: 1, height: 8, borderRadius: 99 }}
              />
            </Paper>

            {isWholeQuizMode && sessionQuestions?.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Question Palette
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {sessionQuestions.map((q, index) => {
                    const status = getQuestionStatus(q, index);
                    return (
                      <Chip
                        key={q.id}
                        label={index + 1}
                        color={getStatusColor(status)}
                        onClick={() => handleQuestionClick(index)}
                        sx={{ cursor: "pointer", minWidth: "40px" }}
                      />
                    );
                  })}
                </Box>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip label="1" color="success" size="small" />
                    <Typography variant="caption">Submitted</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip label="2" color="warning" size="small" />
                    <Typography variant="caption">Selected</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip label="3" color="primary" size="small" />
                    <Typography variant="caption">Current</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip label="4" color="default" size="small" />
                    <Typography variant="caption">Not Answered</Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="subtitle2">Leaderboard</Typography>
              {(leaderboard || []).slice(0, 10).map((l, idx) => (
                <Box
                  key={l.user_id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2">
                    {idx + 1}. {l.user_name}
                  </Typography>
                  <Typography variant="body2">{l.current_score ?? l.points ?? 0}</Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
}

export default LiveSessionPage;
