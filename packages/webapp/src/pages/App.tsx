import { useEffect } from "react";
import { userStore } from "../stores";
import { useRefreshToken } from "../hooks";
import { Outlet } from "react-router-dom";

export default function App() {
  const user = userStore();
  const refresh = useRefreshToken();

  useEffect(() => {
    const initRefreshToken = async () => {
      await refresh();
    };
    initRefreshToken();
  }, []);

  useEffect(() => {
    if (user.token) {
      console.log("should get user");
    }
  }, [user.token, user.isLoggedIn]);

  if (user.isLoading == "idle") {
    return <></>;
  }

  return (
    <div>
      <h1>App</h1>
    </div>
  );
}
