/**
 * Renderer Main Entry Point
 *
 * This is where the React application boots up and mounts to the DOM.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { logger } from "../logger";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Failed to find the root element. The Nexus cannot manifest."
  );
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

logger.info("Renderer process initialized");
