import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import Home from "./pages";
import AuthLayout from "./components/AuthLayout";
import ProfileLayout from "./components/ProfileLayout";

const Loadable =
  (Component: React.ComponentType<any>) => (props: JSX.IntrinsicAttributes) =>
    (
      <Suspense fallback="">
        <Component {...props} />
      </Suspense>
    );

// lazyloads / dynamic import
const ProfilePage = Loadable(lazy(() => import("./pages/profile")));
const SignInPage = Loadable(lazy(() => import("./pages/auth/signin")));
const SignUpPage = Loadable(lazy(() => import("./pages/auth/signup")));

export default function router(user: any) {
  console.log(user);

  const authRoutes: RouteObject = {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "",
        element: <Navigate to="/auth/signin" replace />,
      },
    ],
  };

  const generalRoutes: RouteObject = {
    path: "",
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  };

  const profileRoutes: RouteObject = {
    path: "",
    element: <ProfileLayout />,
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
    ],
  };

  const routes: RouteObject[] = [];

  if (user.isLoggedIn) {
    routes.push(profileRoutes);
  } else {
    routes.push(authRoutes);
    routes.push(generalRoutes);
  }

  const cbr = createBrowserRouter(routes);
  return cbr;
}
