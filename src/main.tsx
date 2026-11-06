import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("عنصر #root در index.html پیدا نشد.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);