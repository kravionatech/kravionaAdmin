import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import { AppGuard } from "../components/AppGaurd.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <AppGuard>
     <App />
   </AppGuard>
    <ToastContainer />
  </StrictMode>,
);
