// Discovery Routes
// Search and discovery related routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAuth from '../guards/RequireAuth';
import BasicLayout from '../layouts/BasicLayout';
import DiscoverScreen from '../screens/discovery/DiscoverScreen';
import SearchScreen from '../screens/discovery/SearchScreen';
import ShareQuizScreen from '../screens/discovery/ShareQuizScreen';

/**
 * Discovery routes configuration
 * Search and discovery routes
 */
export const discoveryRoutes = (
  <>
    {/* Discover - Public Quizzes */}
    <Route
      element={
        <RequireAuth>
          <BasicLayout />
        </RequireAuth>
      }
    >
      <Route path={ROUTES.DISCOVER} element={<DiscoverScreen />} />
      <Route path={ROUTES.SEARCH} element={<SearchScreen />} />
    </Route>

    {/* Share Quiz - Can be accessed without auth initially */}
    <Route
      element={
        <RequireAuth>
          <BasicLayout />
        </RequireAuth>
      }
    >
      <Route path={ROUTES.SHARE_QUIZ} element={<ShareQuizScreen />} />
    </Route>
  </>
);
