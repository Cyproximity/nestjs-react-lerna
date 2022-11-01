import { createBrowserRouter } from "react-router-dom";

import App from "./pages/App";
import { Login, Register } from "./components";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/register",
        element: <Register></Register>,
      },
    ],
  },
]);
