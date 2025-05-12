import { StrictMode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App.tsx";
import { baseUrl } from "@config/env";

console.log("[main.tsx] import.meta.env = ", import.meta.env);
console.log("[main.tsx] baseUrl =", baseUrl);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
