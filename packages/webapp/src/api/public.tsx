import axios from "axios";

export const apiPublic = axios.create({
  baseURL: "/api",
});
