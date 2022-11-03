import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { userStore } from "../stores";

export default function AuthLayout() {
  const { isLoggedIn } = userStore();

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
