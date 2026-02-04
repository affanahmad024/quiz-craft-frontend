import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useEducator } from "../../contexts/educator/EducatorContextProvider";

function EducatorProfilePage() {
  const { id } = useParams();
  const { fetchEducatorProfile } = useEducator();
  const [educator, setEducator] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetchEducatorProfile(id);
      if (res) setEducator(res);
    })();
  }, [id]);

  if (!educator)
    return (
      <AnimatedPage>
        <Container sx={{ py: 8 }}>Loading…</Container>
      </AnimatedPage>
    );

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">
              {educator.name || educator.display_name}
            </Typography>
            <Button variant="contained">Follow</Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {educator.tagline}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Quizzes</Typography>
            {(educator.quizzes || []).map((q) => (
              <Paper key={q.id} sx={{ p: 1, my: 1 }}>
                <Typography>{q.title}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Container>
    </AnimatedPage>
  );
}

export default EducatorProfilePage;
