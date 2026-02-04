import { useEffect } from "react";
import { Container, Typography, Grid } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useEducator } from "../../contexts/educator/EducatorContextProvider";
import EducatorCard from "../../components/educator/EducatorCard";

function FollowingPage() {
  const { fetchEducators, educators } = useEducator();

  useEffect(() => {
    fetchEducators({ following: true });
  }, []);

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Following
        </Typography>
        <Grid container spacing={2}>
          {educators.map((ed) => (
            <Grid item xs={12} md={6} key={ed.id}>
              <EducatorCard educator={ed} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </AnimatedPage>
  );
}

export default FollowingPage;
