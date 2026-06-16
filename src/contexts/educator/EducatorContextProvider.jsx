import { createContext, useContext, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import useNetReq from "../../hooks/NetworkRequest";
import {
  promoteToEducator,
  getEducators,
  getEducatorProfile,
  followEducator,
  unfollowEducator,
  getMyEducatorProfile,
  updateEducatorProfile,
  getFollowers,
} from "../../services/educator/EducatorServices";

const EducatorCtx = createContext();

function EducatorContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const abortContRef = useRef(null);
  const [educators, setEducators] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);

  const fetchEducators = useCallback(
    async (params = {}) => {
      const res = await getEducators(fetchData, abortContRef, params);
      if (res && res.success) {
        const data = res.data?.data || res.data;
        setEducators(data.educators || []);
      }
      return res;
    },
    [fetchData],
  );

  const fetchEducatorProfile = useCallback(
    async (id) => {
      const res = await getEducatorProfile(fetchData, abortContRef, { id });
      if (res && res.success) {
        const data = res.data?.data || res.data;
        return data;
      }
      return res;
    },
    [fetchData],
  );

  const promote = useCallback(
    async (profileData) => {
      const res = await promoteToEducator(fetchData, abortContRef, { profileData });
      if (res && res.success) setIsEducator(true);
      return res;
    },
    [fetchData],
  );

  const follow = useCallback(
    async (id) => {
      const res = await followEducator(fetchData, abortContRef, { id });
      return res;
    },
    [fetchData],
  );

  const unfollow = useCallback(
    async (id) => {
      const res = await unfollowEducator(fetchData, abortContRef, { id });
      return res;
    },
    [fetchData],
  );

  const fetchMyProfile = useCallback(async () => {
    const res = await getMyEducatorProfile(fetchData, abortContRef);
    if (res && res.success) {
      const data = res.data?.data || res.data;
      setProfile(data || null);
      setIsEducator(Boolean(data));
    }
    return res;
  }, [fetchData]);

  const updateProfile = useCallback(
    async (payload) => {
      const res = await updateEducatorProfile(fetchData, abortContRef, { payload });
      if (res && res.success) fetchMyProfile();
      return res;
    },
    [fetchData, fetchMyProfile],
  );

  const fetchFollowers = useCallback(
    async (params = {}) => {
      const res = await getFollowers(fetchData, abortContRef, params);
      if (res && res.success) {
        const data = res.data?.data || res.data;
        setFollowers(data.followers || []);
      }
      return res;
    },
    [fetchData],
  );

  const value = {
    educators,
    isEducator,
    profile,
    followers,
    fetchEducators,
    fetchEducatorProfile,
    promoteToEducator: promote,
    followEducator: follow,
    unfollowEducator: unfollow,
    getMyEducatorProfile: fetchMyProfile,
    updateEducatorProfile: updateProfile,
    getFollowers: fetchFollowers,
  };

  return <EducatorCtx.Provider value={value}>{children}</EducatorCtx.Provider>;
}

EducatorContextProvider.propTypes = { children: PropTypes.node.isRequired };

export const useEducator = () => {
  const ctx = useContext(EducatorCtx);
  if (!ctx)
    throw new Error("useEducator must be used within EducatorContextProvider");
  return ctx;
};

export default EducatorContextProvider;
