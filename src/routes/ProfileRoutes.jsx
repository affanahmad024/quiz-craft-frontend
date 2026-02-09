// Profile Routes
// User profile related routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAuth from '../guards/RequireAuth';
import BasicLayout from '../layouts/BasicLayout';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ProfileStatsScreen from '../screens/profile/ProfileStatsScreen';

/**
 * Profile routes configuration
 * All profile-related routes require authentication
 * Note: Profile editing is now handled inline on ProfileScreen
 */
export const profileRoutes = (
  <Route
    element={
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    }
  >
    {/* View/Edit Profile (inline editing) */}
    <Route path={ROUTES.PROFILE} element={<ProfileScreen />} />

    {/* Profile Statistics */}
    <Route path={ROUTES.PROFILE_STATS} element={<ProfileStatsScreen />} />
  </Route>
);
