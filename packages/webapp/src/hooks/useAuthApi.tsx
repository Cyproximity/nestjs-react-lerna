import { useEffect } from "react";

import { apiAuth } from "../api";
import { userStore } from "../stores";
import { useRefreshToken } from "./useRefreshToken";

export const useAuthApi = () => {
  const user = userStore();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = apiAuth.interceptors.request.use(
      (config) => {
        if (
          config?.headers &&
          !("Authorization" in config.headers) &&
          user.token
        ) {
          config.headers["Authorization"] = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = apiAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiAuth(prevRequest);
        }
      },
    );

    return () => {
      apiAuth.interceptors.request.eject(requestIntercept);
      apiAuth.interceptors.response.eject(responseIntercept);
    };
  }, [user.token, refresh]);

  return apiAuth;
};
