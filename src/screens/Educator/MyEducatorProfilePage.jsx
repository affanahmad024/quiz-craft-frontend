import { useEffect } from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useEducator } from "../../contexts/educator/EducatorContextProvider";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RouteConstants";

function MyEducatorProfilePage() {
  const { profile, getMyEducatorProfile } = useEducator();
  const navigate = useNavigate();

  useEffect(() => {
    getMyEducatorProfile();
  }, []);

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          My Educator Profile
        </Typography>
        {!profile && (
          <Paper sx={{ p: 3 }}>
            <Typography>No educator profile found. Create one.</Typography>
          </Paper>
        )}
        {profile && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">
              {profile.display_name || profile.name}
            </Typography>
            <Typography color="text.secondary">{profile.tagline}</Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.EDIT_EDUCATOR_PROFILE)}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    </AnimatedPage>
  );
}

export default MyEducatorProfilePage;
