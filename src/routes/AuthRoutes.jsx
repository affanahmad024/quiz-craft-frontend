// Auth Routes
// Authentication related routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAuth from '../guards/RequireAuth';
import RequireGuest from '../guards/RequireGuest';
import AuthLayout from '../layouts/AuthLayout';
import BasicLayout from '../layouts/BasicLayout';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';

/**
 * Authentication routes configuration
 * Includes both guest routes (login, signup) and authenticated routes (change password)
 */
export const authRoutes = (
  <>
    {/* Guest Only Routes - Redirects to dashboard if authenticated */}
    <Route
      element={
        <RequireGuest>
          <AuthLayout />
        </RequireGuest>
      }
    >
      <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
      <Route path={ROUTES.SIGNUP} element={<SignupScreen />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordScreen />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordScreen />} />
      <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailScreen />} />
    </Route>

    {/* Authenticated Routes - Requires login */}
    <Route
      element={
        <RequireAuth>
          <BasicLayout />
        </RequireAuth>
      }
    >
      <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePasswordScreen />} />
    </Route>
  </>
);
