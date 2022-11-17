import axios from "axios";

const REFRESH_TOKEN_URL = "/auth/refresh";

export const apiAuth = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const refreshToken = async () => {
  const res = await apiAuth.get(REFRESH_TOKEN_URL);

  if (res?.data?.access_token) {
    const sessionStorage = window.sessionStorage;
    if (sessionStorage) {
      sessionStorage.setItem("atjwt", res?.data?.access_token);
    }
  }

  return res.data;
};

apiAuth.interceptors.response.use(
  (response) => response,
  async (err) => {
    const prevRequest = err.config;
    const reqStatus = err?.response?.status;
    if (
      reqStatus === 401 &&
      !prevRequest.sent &&
      prevRequest.url !== REFRESH_TOKEN_URL
    ) {
      prevRequest.sent = true;
      const newATJWT = await refreshToken();
      prevRequest.headers["Authorization"] = "Bearer " + newATJWT.access;
      return apiAuth(prevRequest);
    }
    return Promise.reject(err);
  },
);

apiAuth.interceptors.request.use(
  (config) => {
    let accessToken: string = "";
    const sessionStorage = window.sessionStorage;
    if (sessionStorage && config.url !== REFRESH_TOKEN_URL) {
      const atjwt = sessionStorage.getItem("atjwt");
      if (atjwt) accessToken = atjwt;
    }
    if (
      config?.headers &&
      !("Authorization" in config.headers) &&
      accessToken
    ) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const getMe = async () => {
  const res = await apiAuth.get("/users/me");
  return res.data;
};

export const getBookmarks = async () => {
  const res = await apiAuth.get("/bookmarks");
  return res.data;
};
