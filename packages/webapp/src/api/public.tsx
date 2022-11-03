import axios from "axios";
import sessionStorage, { keys } from "../utils/sessionStorage";

export const apiPublic = axios.create({
  baseURL: "/api",
});

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const res = await apiPublic.post("/auth/signin", {
    email,
    password,
  });

  if (res?.data?.access_token) {
    sessionStorage.setItem(keys.atjwt, res.data.access_token);
  }

  return res.data;
};
