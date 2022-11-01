import React from "react";
import { RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Router from "./router";
import { Button } from "theme-ui";

export default function Root() {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={Router} />
      <Button>test</Button>
    </>
  );
}
