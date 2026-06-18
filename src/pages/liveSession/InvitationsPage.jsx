import { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";
import { ROUTES, buildRoute } from "../../constants/RouteConstants";

function InvitationsPage() {
  const { getMyInvitations, invitations, joinSession } = useLiveSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const openInvitation = async (sessionId) => {
    const response = await joinSession(sessionId).catch(() => ({ success: false }));
    if (response?.success) {
      navigate(buildRoute(ROUTES.LIVE_SESSION_WAITING, { id: sessionId }));
    }
  };

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
                  {inv.session_title || inv.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  From: {inv.host_name || inv.creator_name || "Session host"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => openInvitation(inv.id)}
                >
                  Open
                </Button>
              </Box>
            </Paper>
          ))}
      </Container>
    </AnimatedPage>
  );
}

export default InvitationsPage;
