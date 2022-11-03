import { Outlet } from "react-router-dom";

function Homepage() {
  return (
    <>
      <h1>Home</h1>
      <main>
        <Outlet />
      </main>
    </>
  );
}
export default Homepage;