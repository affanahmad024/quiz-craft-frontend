import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, Paper, Grid, LinearProgress, Chip, IconButton } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";
import { useQuiz } from "../../contexts/quiz/QuizContextProvider";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

function LiveSessionPage() {
  const { id } = useParams();
  const {
    getSession,
    currentSession,
    currentQuestion,
    timeRemaining,
    submitAnswer,
    hasAnswered,
    leaderboard,
    getLeaderboard,
  } = useLiveSession();

  const { getQuiz, currentQuiz } = useQuiz();

  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [isWholeQuizMode, setIsWholeQuizMode] = useState(false);

  // Load session and check timer mode
  useEffect(() => {
    const load = async () => {
      const sessionResponse = await getSession(id);
      await getLeaderboard(id).catch(() => {});

      console.log("Session response:", sessionResponse);
      console.log("Current session from context:", currentSession);
    };
    load();
  }, [id, getSession, getLeaderboard]);

  // Check timer mode when currentSession updates
  useEffect(() => {
    if (currentSession) {
      console.log("Current session timer_mode:", currentSession.timer_mode);
      console.log("Current session quiz_id:", currentSession.quiz_id);

      if (currentSession.timer_mode === "whole_quiz") {
        setIsWholeQuizMode(true);
        // Fetch full quiz with all questions for whole-quiz timer mode
        if (currentSession.quiz_id) {
          console.log("Fetching quiz with ID:", currentSession.quiz_id);
          getQuiz(currentSession.quiz_id, true);
        }
      }
    }
  }, [currentSession, getQuiz]);

  // For whole-quiz mode, get current question from quiz
  const getCurrentQuestion = () => {
    if (isWholeQuizMode && currentQuiz?.questions) {
      console.log("Whole quiz mode - getting question at index:", currentQuestionIndex);
      console.log("Total questions:", currentQuiz.questions.length);
      return currentQuiz.questions[currentQuestionIndex];
    }
    console.log("Per-question mode - currentQuestion:", currentQuestion);
    return currentQuestion;
  };

  const activeQuestion = getCurrentQuestion();

  console.log("Active question:", activeQuestion);
  console.log("Is whole quiz mode:", isWholeQuizMode);
  console.log("Current quiz:", currentQuiz);

  // Handle answer submission
  const handleAnswer = async (answerId) => {
    if (submitting) return;

    // For whole-quiz mode, check if already answered
    if (isWholeQuizMode && answeredQuestions[activeQuestion?.id]) {
      toast.error("You have already answered this question");
      return;
    }

    // For per-question mode, check hasAnswered
    if (!isWholeQuizMode && hasAnswered) {
      return;
    }

    setSubmitting(true);

    const timeTakenMs = isWholeQuizMode
      ? 0 // For whole-quiz mode, time tracking is different
      : Math.max(0, activeQuestion.timer_seconds - (timeRemaining || 0)) * 1000;

    const response = await submitAnswer(id, activeQuestion.id, answerId, timeTakenMs).catch(
      () => ({ success: false }),
    );

    if (response.success) {
      // Mark question as answered in whole-quiz mode
      if (isWholeQuizMode) {
        setAnsweredQuestions(prev => ({
          ...prev,
          [activeQuestion.id]: answerId
        }));
        toast.success("Answer saved!");
      }
    }

    setSubmitting(false);
    // Refresh leaderboard after submit
    getLeaderboard(id).catch(() => {});
  };

  // Navigation handlers for whole-quiz mode
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (currentQuiz?.questions?.length || 0) - 1) {
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
          <Typography variant="h4" sx={{ my: 1, color: timeRemaining < 60 ? "error.main" : "inherit" }}>
            {formatTime(timeRemaining)}
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <Typography variant="subtitle1">Question Time</Typography>
          <Typography variant="h4" sx={{ my: 1, color: timeRemaining < 10 ? "error.main" : "inherit" }}>
            {timeRemaining}s
          </Typography>
        </>
      );
    }
  };

  // Get question status for palette
  const getQuestionStatus = (question, index) => {
    if (answeredQuestions[question.id]) {
      return "answered";
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
      case "current":
        return "primary";
      default:
        return "default";
    }
  };

  if (!activeQuestion) {
    return (
      <AnimatedPage>
        <Container sx={{ py: 6 }}>Waiting for question…</Container>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">
                  Question {isWholeQuizMode ? currentQuestionIndex + 1 : activeQuestion?.position}
                  {isWholeQuizMode && ` of ${currentQuiz?.questions?.length || 0}`}
                </Typography>
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
                      disabled={currentQuestionIndex >= (currentQuiz?.questions?.length || 0) - 1}
                      size="small"
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Typography variant="body1" sx={{ my: 2 }}>
                {activeQuestion?.text}
              </Typography>

              <Box sx={{ display: "grid", gap: 2 }}>
                {(activeQuestion?.options || []).map((opt) => {
                  const isAnswered = isWholeQuizMode
                    ? !!answeredQuestions[activeQuestion.id]
                    : hasAnswered;
                  const isSelected = answeredQuestions[activeQuestion.id] === opt.id;

                  return (
                    <Button
                      key={opt.id}
                      variant={isSelected ? "contained" : isAnswered ? "outlined" : "contained"}
                      onClick={() => handleAnswer(opt.id)}
                      disabled={isAnswered || submitting}
                      sx={{
                        textTransform: "none",
                        justifyContent: "flex-start",
                        textAlign: "left",
                        bgcolor: isSelected ? "primary.main" : undefined,
                        color: isSelected ? "white" : undefined,
                      }}
                    >
                      {opt.label}
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
                    disabled={currentQuestionIndex >= (currentQuiz?.questions?.length || 0) - 1}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 2 }}>
              {getTimerDisplay()}
              {currentSession?.timer_mode === "whole_quiz" && (
                <LinearProgress
                  variant="determinate"
                  value={
                    ((currentSession?.whole_quiz_timer_seconds - timeRemaining) /
                      currentSession?.whole_quiz_timer_seconds) *
                    100
                  }
                  sx={{ mt: 1 }}
                />
              )}
            </Paper>

            {isWholeQuizMode && currentQuiz?.questions && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Question Palette
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {currentQuiz.questions.map((q, index) => {
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
                    <Typography variant="caption">Answered</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip label="2" color="primary" size="small" />
                    <Typography variant="caption">Current</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip label="3" color="default" size="small" />
                    <Typography variant="caption">Not Answered</Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            <Paper sx={{ p: 2 }}>
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
                  <Typography variant="body2">{l.points}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
}

export default LiveSessionPage;
