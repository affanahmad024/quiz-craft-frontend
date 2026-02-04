import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useEducator } from "../../contexts/educator/EducatorContextProvider";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RouteConstants";

function EditEducatorProfilePage() {
  const { profile, getMyEducatorProfile, updateEducatorProfile } =
    useEducator();
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await getMyEducatorProfile();
    })();
  }, []);

  useEffect(() => {
    if (profile) {
      setTagline(profile.tagline || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateEducatorProfile({ tagline, bio });
    navigate(ROUTES.MY_EDUCATOR_PROFILE);
  };

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Edit Educator Profile
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
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            multiline
            minRows={4}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
}

export default EditEducatorProfilePage;
