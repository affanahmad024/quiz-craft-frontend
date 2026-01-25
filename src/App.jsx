// Root App Component
// Following Phoenix pattern

import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/RouteConstants";
import PageNotFound from "./components/screens/PageNotFound";
import LoadingScreen from "./components/screens/LoadingScreen";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { authRoutes } from "./routes/AuthRoutes";
import { quizRoutes } from "./routes/QuizRoutes";
import { attemptRoutes } from "./routes/AttemptRoutes";
import { discoveryRoutes } from "./routes/DiscoveryRoutes";
import { profileRoutes } from "./routes/ProfileRoutes";
import { adminRoutes } from "./routes/AdminRoutes";
import { aiRoutes } from "./routes/AIRoutes";
import RequireAuth from "./guards/RequireAuth";
import BasicLayout from "./layouts/BasicLayout";
import DashboardScreen from "./screens/DashboardScreen";
import LandingPage from "./screens/LandingPage";

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen message="Loading application..." />}>
        <Routes>
          {/* Home/Landing Page */}
          <Route path={ROUTES.HOME} element={<LandingPage />} />

          {/* Auth Routes */}
          {authRoutes}

          {/* Quiz Routes */}
          {quizRoutes}

          {/* Attempt Routes */}
          {attemptRoutes}

          {/* Discovery Routes */}
          {discoveryRoutes}

          {/* Profile Routes */}
          {profileRoutes}

          {/* Admin Routes */}
          {adminRoutes}

          {/* AI Routes */}
          {aiRoutes}

          {/* Dashboard Route */}
          <Route
            element={
              <RequireAuth>
                <BasicLayout />
              </RequireAuth>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<DashboardScreen />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
