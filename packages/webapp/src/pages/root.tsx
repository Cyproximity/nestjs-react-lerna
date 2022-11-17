import { QueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

export const loader = (queryClient: QueryClient) => () => {};

export default function Root() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
