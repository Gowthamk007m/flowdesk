import React from "react";
import ReactDOM from "react-dom/client";

import AppRouter from "./routes/AppRouter";
import QueryProvider from "./providers/QueryProvider";

import { AuthProvider } from "@/features/auth/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>
);