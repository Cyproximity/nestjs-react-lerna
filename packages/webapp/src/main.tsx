import * as React from "react";
import * as ReactDOM from "react-dom/client";

import Root from "./root";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
