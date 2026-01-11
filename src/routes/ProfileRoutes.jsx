// Profile Routes
// User profile related routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAuth from '../guards/RequireAuth';
import BasicLayout from '../layouts/BasicLayout';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ProfileStatsScreen from '../screens/profile/ProfileStatsScreen';

/**
 * Profile routes configuration
 * All profile-related routes require authentication
 */
export const profileRoutes = (
  <Route
    element={
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    }
  >
    {/* View Profile */}
    <Route path={ROUTES.PROFILE} element={<ProfileScreen />} />

    {/* Edit Profile */}
    <Route path={ROUTES.PROFILE_EDIT} element={<EditProfileScreen />} />

    {/* Profile Statistics */}
    <Route path={ROUTES.PROFILE_STATS} element={<ProfileStatsScreen />} />
  </Route>
);
