import { Outlet } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";
import { userStore } from "../stores";

export default function AuthLayout() {
  const { isLoggedIn } = userStore();
  const location = useLocation();

  if (location.pathname === "/auth/") {
    return <Navigate to="/auth/signin" replace />;
  }

  if (isLoggedIn) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <>
      Auth Layout
      <main>
        <Outlet />
      </main>
    </>
  );
}
