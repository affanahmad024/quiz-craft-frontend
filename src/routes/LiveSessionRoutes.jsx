// Live Session Routes
// Live session related routes
// Following Phoenix pattern

import { Route } from "react-router-dom";
import { ROUTES } from "../constants/RouteConstants";
import RequireAuth from "../guards/RequireAuth";
import BasicLayout from "../layouts/BasicLayout";
import LiveSessionsPage from "../pages/liveSession/LiveSessionsPage";
import CreateSessionPage from "../pages/liveSession/CreateSessionPage";
import WaitingRoomPage from "../pages/liveSession/WaitingRoomPage";
import LiveSessionPage from "../pages/liveSession/LiveSessionPage";
import ResultsPage from "../pages/liveSession/ResultsPage";
import MySessionsPage from "../pages/liveSession/MySessionsPage";
import InvitationsPage from "../pages/liveSession/InvitationsPage";

/**
 * Live Session routes configuration
 * All live session routes require authentication
 */
export const liveSessionRoutes = (
  <Route
    element={
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    }
  >
    {/* Browse Public Sessions */}
    <Route path={ROUTES.LIVE_SESSIONS} element={<LiveSessionsPage />} />

    {/* Create Session */}
    <Route path={ROUTES.LIVE_SESSION_CREATE} element={<CreateSessionPage />} />

    {/* My Sessions */}
    <Route path={ROUTES.MY_SESSIONS} element={<MySessionsPage />} />

    {/* Session Invitations */}
    <Route path={ROUTES.SESSION_INVITATIONS} element={<InvitationsPage />} />

    {/* Waiting Room */}
    <Route path={ROUTES.LIVE_SESSION_WAITING} element={<WaitingRoomPage />} />

    {/* Live Session (Active Game) */}
    <Route path={ROUTES.LIVE_SESSION_LIVE} element={<LiveSessionPage />} />

    {/* Results */}
    <Route path={ROUTES.LIVE_SESSION_RESULTS} element={<ResultsPage />} />

    {/* Session Detail (fallback) */}
    <Route path={ROUTES.LIVE_SESSION_DETAIL} element={<LiveSessionsPage />} />
  </Route>
);
