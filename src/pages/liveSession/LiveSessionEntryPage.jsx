import { useEffect } from "react";
import { Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { SESSION_STATUS } from "../../constants/LiveSessionConstants";
import { ROUTES, buildRoute } from "../../constants/RouteConstants";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";

function LiveSessionEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSession } = useLiveSession();

  useEffect(() => {
    const load = async () => {
      const response = await getSession(id);
      const session = response?.session || response?.data?.data || response?.data;

      if (session?.status === SESSION_STATUS.LIVE) {
        navigate(buildRoute(ROUTES.LIVE_SESSION_LIVE, { id }), { replace: true });
        return;
      }

      if (session?.status === SESSION_STATUS.COMPLETED) {
        navigate(buildRoute(ROUTES.LIVE_SESSION_RESULTS, { id }), { replace: true });
        return;
      }

      navigate(buildRoute(ROUTES.LIVE_SESSION_WAITING, { id }), { replace: true });
    };

    load();
  }, [getSession, id, navigate]);

  return (
    <AnimatedPage>
      <Container sx={{ py: 6 }}>Loading session...</Container>
    </AnimatedPage>
  );
}

export default LiveSessionEntryPage;
