// Admin Routes
// Admin management related routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAdmin from '../guards/RequireAdmin';
import BasicLayout from '../layouts/BasicLayout';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageUsersScreen from '../screens/admin/ManageUsersScreen';
import ManageQuizzesScreen from '../screens/admin/ManageQuizzesScreen';

/**
 * Admin routes configuration
 * All admin routes require admin role
 */
export const adminRoutes = (
  <Route
    element={
      <RequireAdmin>
        <BasicLayout />
      </RequireAdmin>
    }
  >
    {/* Admin Dashboard */}
    <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardScreen />} />

    {/* Manage Users */}
    <Route path={ROUTES.ADMIN_USERS} element={<ManageUsersScreen />} />

    {/* Manage Quizzes */}
    <Route path={ROUTES.ADMIN_QUIZZES} element={<ManageQuizzesScreen />} />
  </Route>
);
