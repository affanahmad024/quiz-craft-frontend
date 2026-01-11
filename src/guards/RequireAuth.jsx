// Require Auth Guard
// Following Phoenix pattern for protected routes

import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import LoadingScreen from '../components/screens/LoadingScreen';
import { ROUTES } from '../constants/RouteConstants';

/**
 * Route guard that requires authentication
 * Redirects to login if not authenticated
 */
function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login, saving the attempted location
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
