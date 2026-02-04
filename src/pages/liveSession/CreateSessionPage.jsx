import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";
import { ROUTES, buildRoute } from "../../constants/RouteConstants";

function CreateSessionPage() {
  const navigate = useNavigate();
  const { createSession } = useLiveSession();

  const [title, setTitle] = useState("");
  const [quizId, setQuizId] = useState("");
  const [timerSec, setTimerSec] = useState(30);
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [discoverable, setDiscoverable] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const sessionData = {
      title,
      quiz_id: quizId,
      timer_seconds: timerSec,
      max_participants: maxParticipants,
      is_public: discoverable,
    };

    const res = await createSession(sessionData);
    setIsCreating(false);

    if (res && res.success) {
      const session = res.session || res.data || res;
      const id = session.id || (session.data && session.data.id);
      if (id) {
        navigate(buildRoute(ROUTES.LIVE_SESSION_WAITING, { id }));
      } else {
        navigate(ROUTES.LIVE_SESSIONS);
      }
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Create Live Session
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Session Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            label="Quiz ID"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            helperText="Enter the quiz id from your published quizzes"
            required
          />

          <TextField
            label="Timer (seconds)"
            type="number"
            value={timerSec}
            onChange={(e) => setTimerSec(Number(e.target.value))}
            inputProps={{ min: 5, max: 300 }}
          />

          <TextField
            label="Max Participants"
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={discoverable}
                onChange={(e) => setDiscoverable(e.target.checked)}
              />
            }
            label="Discoverable (Public)"
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.LIVE_SESSIONS)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isCreating}>
              {isCreating ? "Creating…" : "Create Session"}
            </Button>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
}

export default CreateSessionPage;
