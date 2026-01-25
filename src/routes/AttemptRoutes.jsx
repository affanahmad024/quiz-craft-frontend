// Attempt Routes
// Quiz attempt related routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAuth from '../guards/RequireAuth';
import BasicLayout from '../layouts/BasicLayout';
import QuizInstructionsScreen from '../screens/attempt/QuizInstructionsScreen';
import TakeQuizScreen from '../screens/attempt/TakeQuizScreen';
import QuizResultScreen from '../screens/attempt/QuizResultScreen';
import AttemptListScreen from '../screens/attempt/AttemptListScreen';

/**
 * Attempt routes configuration
 * All attempt-related routes require authentication
 */
export const attemptRoutes = (
  <Route
    element={
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    }
  >
    {/* Quiz Instructions (before starting) */}
    <Route path={ROUTES.QUIZ_START} element={<QuizInstructionsScreen />} />

    {/* Take Quiz (existing attempt) */}
    <Route path={ROUTES.QUIZ_TAKE} element={<TakeQuizScreen />} />

    {/* Attempt Results */}
    <Route path={ROUTES.ATTEMPT_RESULTS} element={<QuizResultScreen />} />

    {/* Attempt List */}
    <Route path={ROUTES.ATTEMPT_LIST} element={<AttemptListScreen />} />
  </Route>
);
