// Live Session Routes
// Live session related routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAuth from '../guards/RequireAuth';
import BasicLayout from '../layouts/BasicLayout';
import LiveSessionsPage from '../pages/liveSession/LiveSessionsPage';

// Placeholder components for routes not yet implemented
// These can be replaced with actual implementations later
const CreateSessionPage = () => <div>Create Session Page - Coming Soon</div>;
const WaitingRoomPage = () => <div>Waiting Room - Coming Soon</div>;
const LiveSessionPage = () => <div>Live Session - Coming Soon</div>;
const ResultsPage = () => <div>Results - Coming Soon</div>;
const MySessionsPage = () => <div>My Sessions - Coming Soon</div>;
const InvitationsPage = () => <div>Invitations - Coming Soon</div>;

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
