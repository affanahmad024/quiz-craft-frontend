// AI Routes
// Following Phoenix pattern

import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/RouteConstants';
import RequireAuth from '../guards/RequireAuth';
import BasicLayout from '../layouts/BasicLayout';
import AIQuizGenerationScreen from '../screens/ai/AIQuizGenerationScreen';

export const aiRoutes = (
  <Route
    element={
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    }
  >
    <Route path={ROUTES.AI_GENERATE} element={<AIQuizGenerationScreen />} />
  </Route>
);
