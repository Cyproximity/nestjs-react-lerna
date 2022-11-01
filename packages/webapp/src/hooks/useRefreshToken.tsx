import { apiAuth } from "../api";
import { userStore } from "../stores";

export const useRefreshToken = () => {
  const user = userStore();

  const refresh = async () => {
    try {
      user.setLoading(true);
      const response = await apiAuth.get("/auth/refresh");
      if (response && response.data && response.data.access_token) {
        console.log("[useRefreshToken]:", response.data.access_token);
        user.setToken(response.data.access_token);
        user.setIsLoggedIn(true);
        user.setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return refresh;
};
