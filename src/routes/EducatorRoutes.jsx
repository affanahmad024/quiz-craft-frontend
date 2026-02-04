import { Route } from "react-router-dom";
import { ROUTES } from "../constants/RouteConstants";
import RequireAuth from "../guards/RequireAuth";
import BasicLayout from "../layouts/BasicLayout";
import BecomeEducatorPage from "../screens/Educator/BecomeEducatorPage";
import EducatorsPage from "../screens/Educator/EducatorsPage";
import EducatorProfilePage from "../screens/Educator/EducatorProfilePage";
import MyEducatorProfilePage from "../screens/Educator/MyEducatorProfilePage";
import EditEducatorProfilePage from "../screens/Educator/EditEducatorProfilePage";
import FollowingPage from "../screens/Educator/FollowingPage";
import FollowersPage from "../screens/Educator/FollowersPage";

export const educatorRoutes = (
  <Route
    element={
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    }
  >
    <Route path={ROUTES.BECOME_EDUCATOR} element={<BecomeEducatorPage />} />
    <Route path={ROUTES.EDUCATORS} element={<EducatorsPage />} />
    <Route path={ROUTES.EDUCATOR_PROFILE} element={<EducatorProfilePage />} />
    <Route
      path={ROUTES.MY_EDUCATOR_PROFILE}
      element={<MyEducatorProfilePage />}
    />
    <Route
      path={ROUTES.EDIT_EDUCATOR_PROFILE}
      element={<EditEducatorProfilePage />}
    />
    <Route path={ROUTES.FOLLOWING_EDUCATORS} element={<FollowingPage />} />
    <Route path={ROUTES.EDUCATOR_FOLLOWERS} element={<FollowersPage />} />
  </Route>
);
