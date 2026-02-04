import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, Paper, Grid } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";
import { useParams } from "react-router-dom";

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

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      await getSession(id);
      await getLeaderboard(id).catch(() => {});
    };
    load();
  }, [id]);

  if (!currentQuestion) {
    return (
      <AnimatedPage>
        <Container sx={{ py: 6 }}>Waiting for question…</Container>
      </AnimatedPage>
    );
  }

  const handleAnswer = async (answerId) => {
    if (hasAnswered || submitting) return;
    setSubmitting(true);

    const timeTakenMs =
      Math.max(0, currentQuestion.timer_seconds - (timeRemaining || 0)) * 1000;

    await submitAnswer(id, currentQuestion.id, answerId, timeTakenMs).catch(
      () => {},
    );
    setSubmitting(false);
    // refresh leaderboard after submit
    getLeaderboard(id).catch(() => {});
  };

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">
                Question {currentQuestion?.position}
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                {currentQuestion?.text}
              </Typography>

              <Box sx={{ display: "grid", gap: 2 }}>
                {(currentQuestion?.options || []).map((opt) => (
                  <Button
                    key={opt.id}
                    variant={hasAnswered ? "outlined" : "contained"}
                    onClick={() => handleAnswer(opt.id)}
                    disabled={hasAnswered || submitting}
                    sx={{ textTransform: "none" }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Time Remaining</Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {timeRemaining}s
              </Typography>

              <Box sx={{ mt: 2 }}>
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
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
}

export default LiveSessionPage;
