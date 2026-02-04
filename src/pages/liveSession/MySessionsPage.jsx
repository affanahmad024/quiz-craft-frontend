import { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";

function MySessionsPage() {
  const { getMySessions, mySessions, startSession } = useLiveSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getMySessions().catch(() => {});
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          My Live Sessions
        </Typography>

        {loading && <Typography>Loading…</Typography>}

        {!loading && mySessions && mySessions.length === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography>
              No sessions yet. Create a session to get started.
            </Typography>
          </Paper>
        )}

        {!loading &&
          mySessions &&
          mySessions.map((s) => (
            <Paper
              key={s.id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{s.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Status: {s.status}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="outlined">Edit</Button>
                <Button variant="outlined" color="error">
                  Delete
                </Button>
                {s.status !== "live" && (
                  <Button
                    variant="contained"
                    onClick={() => startSession(s.id)}
                  >
                    Start
                  </Button>
                )}
                {s.status === "live" && (
                  <Button variant="contained" disabled>
                    Live
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
      </Container>
    </AnimatedPage>
  );
}

export default MySessionsPage;
