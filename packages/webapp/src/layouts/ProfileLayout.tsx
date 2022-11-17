import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { userStore } from "../stores";
import { getMe } from "../api";

const ProfileLayout = () => {
  const location = useLocation();
  const { user, isLoggedIn, setUser, setIsLoggedIn } = userStore();
  const [cookie] = useCookies(["loggedin"]);

  const { isLoading, isFetching } = useQuery(["authUser"], () => getMe(), {
    enabled: !!cookie.loggedin,
    retry: 1,
    select: (user) => user,
    onSuccess: (user) => {
      setUser(user);
      setIsLoggedIn(true);
    },
  });

  const loading = isLoading || isFetching;

  if (loading) {
    return <>Loading...</>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <>
      <h1>Profile</h1>
      <Outlet />
    </>
  );
};

export default ProfileLayout;
