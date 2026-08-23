import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";

// Self-hosted (not Google Fonts CDN) so the app has zero runtime network
// dependency — required for it to actually work offline, not just be
// installable. Latin subset only (the UI is English-only) and only the
// weights actually used — the unrestricted import pulls every language
// subset in both woff/woff2, ~900KB of precache for a mobile-first app.
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-700.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
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
