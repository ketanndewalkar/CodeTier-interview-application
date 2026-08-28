import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClientProviderWrapper } from "./app/provider.jsx";

createRoot(document.getElementById("root")).render(
    <QueryClientProviderWrapper>
      <App />
    </QueryClientProviderWrapper>
);
