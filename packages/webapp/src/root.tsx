import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Router from "./router";
import AuthMiddleware from "./middleware/AuthMiddleware";
import { userStore } from "./stores";

const queryClient = new QueryClient();

export default function Root() {
  const user = userStore();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthMiddleware> */}
      <RouterProvider router={Router(user, queryClient)} />
      {/* </AuthMiddleware> */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
