import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

import Root, { loader as RootLoader } from "./pages/root";
import AuthLayout from "./layouts/AuthLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import BookmarkLayout from "./layouts/BookmarkLayout";

import ProfilePage from "./pages/profile";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";
import BookmarkPage, { loader as bookmarkLoader } from "./pages/bookmark";

export default function router(user: any, queryClient: QueryClient) {
  const authRoutes: RouteObject = {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
    ],
  };

  const bookmarkRoutes: RouteObject = {
    path: "bookmarks",
    element: <BookmarkLayout />,
    children: [
      {
        index: true,
        loader: bookmarkLoader(queryClient),
        element: <BookmarkPage />,
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

  let children: RouteObject[] = [];

  const routes: RouteObject[] = [
    {
      path: "/",
      loader: RootLoader(queryClient),
      children: children,
    },
  ];

  return createBrowserRouter(routes);
}
