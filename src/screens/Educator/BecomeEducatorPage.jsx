import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useNavigate } from "react-router-dom";
import { useEducator } from "../../contexts/educator/EducatorContextProvider";
import { ROUTES } from "../../constants/RouteConstants";

function BecomeEducatorPage() {
  const navigate = useNavigate();
  const { promoteToEducator, getMyEducatorProfile } = useEducator();
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMyEducatorProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) return;
    setLoading(true);
    await promoteToEducator({ tagline, bio });
    setLoading(false);
    navigate(ROUTES.MY_EDUCATOR_PROFILE);
  };

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Become an Educator
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your educator profile to publish quizzes and host live
          sessions.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
          <TextField
            label="Short Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            multiline
            minRows={3}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            }
            label="I agree to Educator Terms"
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!agree || loading}
            >
              {loading ? "Submitting…" : "Become Educator"}
            </Button>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
}

export default BecomeEducatorPage;
