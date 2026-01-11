// Require Guest Guard
// Redirects authenticated users away from auth pages

import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import LoadingScreen from '../components/screens/LoadingScreen';
import { ROUTES } from '../constants/RouteConstants';

/**
 * Route guard that requires user to be NOT authenticated
 * Redirects to dashboard if already authenticated
 */
function RequireGuest({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (isAuthenticated) {
    // Already logged in, redirect to dashboard
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

RequireGuest.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireGuest;
