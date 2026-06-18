import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";
import { useAuth } from "../../contexts/auth/AuthContextProvider";

function WaitingRoomPage() {
  const { id } = useParams();
  const {
    getSession,
    currentSession,
    participants,
    getLeaderboard,
    startSession,
    leaveSession,
    connectToSession,
  } = useLiveSession();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const isCreator =
    currentSession?.creator_id &&
    (currentSession.creator_id === user?.id || currentSession.creator_id === user?.user_id);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getSession(id);
      await getLeaderboard(id).catch(() => {});
      connectToSession(id);
      setLoading(false);
    };

    load();
  }, [id, getSession, getLeaderboard, connectToSession]);

  if (loading)
    return (
      <AnimatedPage>
        <Container sx={{ py: 8 }}>Loading…</Container>
      </AnimatedPage>
    );

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {currentSession?.title || "Session"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Waiting for host to start the session
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">
                Participants ({participants?.length || 0})
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                {(participants || []).slice(0, 12).map((p) => (
                  <Avatar key={p.id} alt={p.user_name} src={p.avatar_url}>
                    {p.user_name?.charAt(0)}
                  </Avatar>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Quiz</Typography>
              <Typography variant="body2">
                {currentSession?.quiz_title || "—"}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => leaveSession(id)}
            >
              Leave Session
            </Button>
            {isCreator && (
              <Button variant="contained" onClick={() => startSession(id)}>
                Start Now
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </AnimatedPage>
  );
}

export default WaitingRoomPage;
