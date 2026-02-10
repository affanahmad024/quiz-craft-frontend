import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";
import { ROUTES, buildRoute } from "../../constants/RouteConstants";
import { listMyQuizzes } from "../../services/quiz/QuizServices";
import useNetReq from "../../hooks/NetworkRequest";
import toast from "react-hot-toast";

function CreateSessionPage() {
  const navigate = useNavigate();
  const { createSession } = useLiveSession();
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  const [title, setTitle] = useState("");
  const [quizId, setQuizId] = useState("");
  const [timerMode, setTimerMode] = useState("per_question");
  const [questionTimerSec, setQuestionTimerSec] = useState(30);
  const [wholeQuizTimerSec, setWholeQuizTimerSec] = useState(600);
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [discoverable, setDiscoverable] = useState(true);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Quiz dropdown state
  const [quizzes, setQuizzes] = useState([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);

  // Fetch user's quizzes on mount
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await listMyQuizzes(fetchData, abortContRef, {
          page: 1,
          limit: 100, // Get all published quizzes
        });

        if (response.success && response.data && response.data.data && response.data.data.quizzes) {
          // Filter only published quizzes
          const publishedQuizzes = response.data.data.quizzes.filter(
            (quiz) => quiz.is_published === true
          );
          setQuizzes(publishedQuizzes);
        } else {
          toast.error("Failed to load quizzes");
        }
      } catch (error) {
        console.error("Error loading quizzes:", error);
        toast.error("Failed to load quizzes");
      } finally {
        setIsLoadingQuizzes(false);
      }
    };

    loadQuizzes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const sessionData = {
      title,
      quiz_id: quizId,
      session_type: discoverable ? "public" : "private",
      progression_mode: "automatic",
      timer_mode: timerMode,
      max_participants: maxParticipants,
      is_discoverable: discoverable,
    };

    // Add appropriate timer field based on mode
    if (timerMode === "per_question") {
      sessionData.question_timer_seconds = questionTimerSec;
    } else {
      sessionData.whole_quiz_timer_seconds = wholeQuizTimerSec;
    }

    // Public sessions must be scheduled
    if (discoverable && scheduledAt) {
      sessionData.scheduled_at = new Date(scheduledAt).toISOString();
    }

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            select
            label="Select Quiz"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            helperText="Choose a published quiz for this live session"
            required
            disabled={isLoadingQuizzes}
          >
            {isLoadingQuizzes ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading quizzes...
              </MenuItem>
            ) : quizzes.length === 0 ? (
              <MenuItem disabled>No published quizzes available</MenuItem>
            ) : (
              quizzes.map((quiz) => (
                <MenuItem key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </MenuItem>
              ))
            )}
          </TextField>

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Timer Mode</FormLabel>
            <RadioGroup
              value={timerMode}
              onChange={(e) => setTimerMode(e.target.value)}
            >
              <FormControlLabel
                value="per_question"
                control={<Radio />}
                label="Per-Question Timer (each question has its own timer)"
              />
              <FormControlLabel
                value="whole_quiz"
                control={<Radio />}
                label="Whole-Quiz Timer (total time for entire quiz)"
              />
            </RadioGroup>
          </FormControl>

          {timerMode === "per_question" ? (
            <TextField
              label="Timer per Question (seconds)"
              type="number"
              value={questionTimerSec}
              onChange={(e) => setQuestionTimerSec(Number(e.target.value))}
              inputProps={{ min: 5, max: 300 }}
              helperText="Time limit for each question"
            />
          ) : (
            <TextField
              label="Total Quiz Timer (seconds)"
              type="number"
              value={wholeQuizTimerSec}
              onChange={(e) => setWholeQuizTimerSec(Number(e.target.value))}
              inputProps={{ min: 60, max: 7200 }}
              helperText={`Total time for the entire quiz (${formatTime(
                wholeQuizTimerSec
              )})`}
            />
          )}

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

          {discoverable && (
            <TextField
              label="Scheduled Start Time"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Public sessions must be scheduled for a future time"
              inputProps={{
                min: new Date().toISOString().slice(0, 16),
              }}
            />
          )}

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
