import { useEffect } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useEducator } from "../../contexts/educator/EducatorContextProvider";

function FollowersPage() {
  const { getFollowers, followers } = useEducator();

  useEffect(() => {
    getFollowers();
  }, []);

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Followers
        </Typography>
        {followers.map((f) => (
          <Paper key={f.id} sx={{ p: 2, mb: 1 }}>
            <Typography>{f.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {f.email}
            </Typography>
          </Paper>
        ))}
      </Container>
    </AnimatedPage>
  );
}

export default FollowersPage;
