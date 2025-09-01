import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router.tsx";
import { RouterProvider } from "react-router-dom";
import { Toast } from "./components/Toast.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toast>
      <RouterProvider router={router} />
    </Toast>
  </StrictMode>
);
