import { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";

function InvitationsPage() {
  const { getMyInvitations, invitations } = useLiveSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getMyInvitations().catch(() => {});
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Session Invitations
        </Typography>

        {loading && <Typography>Loading…</Typography>}

        {!loading && invitations && invitations.length === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography>No invitations found.</Typography>
          </Paper>
        )}

        {!loading &&
          invitations &&
          invitations.map((inv) => (
            <Paper
              key={inv.id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {inv.session_title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  From: {inv.host_name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained">Accept</Button>
                <Button variant="outlined" color="error">
                  Decline
                </Button>
              </Box>
            </Paper>
          ))}
      </Container>
    </AnimatedPage>
  );
}

export default InvitationsPage;
