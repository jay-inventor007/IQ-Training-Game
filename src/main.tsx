import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// HashRouter (not BrowserRouter): the app is deployed to GitHub Pages, a
// static host with no server-side rewrite for client-side routes — a hard
// refresh on e.g. /train/fluidReasoning would 404 with path-based routing.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
