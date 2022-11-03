import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      Layout Thingy
      <main>
        <Outlet />
      </main>
    </>
  );
}
