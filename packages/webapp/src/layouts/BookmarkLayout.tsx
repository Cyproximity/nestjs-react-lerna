import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function BookmarkLayout() {
  return (
    <>
      <h1>Bookmark layout</h1>
      <Link to={"/"}>Home</Link>
      <Outlet></Outlet>
    </>
  );
}
