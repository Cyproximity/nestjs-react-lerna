import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { getMe } from "../api";
import { userStore } from "../stores";

interface AuthMiddlewareProps {
  children: React.ReactElement;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [cookie] = useCookies(["loggedin"]);
  const { setUser, setIsLoggedIn, isLoggedIn } = userStore();

  const query = useQuery(["authUser"], () => getMe(), {
    enabled: !!cookie?.loggedin,
    select: (user) => user,
    onSuccess: (user) => {
      setUser(user);
      setIsLoggedIn(true);
    },
  });

  return children;
};

export default AuthMiddleware;
