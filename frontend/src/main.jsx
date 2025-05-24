import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RouterPage from "./routes/Routes";
import { AuthContextProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterPage />
    </AuthContextProvider>
  </StrictMode>
);
