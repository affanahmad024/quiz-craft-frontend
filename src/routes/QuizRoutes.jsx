// Quiz Routes
// Quiz management related routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAuth from '../guards/RequireAuth';
import BasicLayout from '../layouts/BasicLayout';
import QuizListScreen from '../screens/quiz/QuizListScreen';
import CreateQuizScreen from '../screens/quiz/CreateQuizScreen';
import QuizDetailScreen from '../screens/quiz/QuizDetailScreen';
import EditQuizScreen from '../screens/quiz/EditQuizScreen';

/**
 * Quiz routes configuration
 * All quiz-related routes require authentication
 */
export const quizRoutes = (
  <Route
    element={
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    }
  >
    {/* Quiz List */}
    <Route path={ROUTES.QUIZ_LIST} element={<QuizListScreen />} />

    {/* Create Quiz */}
    <Route path={ROUTES.QUIZ_CREATE} element={<CreateQuizScreen />} />

    {/* Quiz Detail */}
    <Route path={ROUTES.QUIZ_DETAIL} element={<QuizDetailScreen />} />

    {/* Edit Quiz */}
    <Route path={ROUTES.QUIZ_EDIT} element={<EditQuizScreen />} />
  </Route>
);
