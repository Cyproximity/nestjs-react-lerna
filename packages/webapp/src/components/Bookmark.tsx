import { useEffect } from "react";
import { userStore } from "../stores";

export function Bookmark() {
  const user = userStore();
  useEffect(() => {}, []);
  return <></>;
}
