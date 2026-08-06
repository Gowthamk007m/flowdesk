import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import CaseDetailsPage from "@/pages/CaseDetailsPage";
import CasesPage from "@/pages/CasesPage";
import CreateCasePage from "@/pages/CreateCasePage";
import DashboardPage from "@/pages/DashboardPage";
import EditCasePage from "@/pages/EditCasePage";
import LoginPage from "@/pages/LoginPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="cases/new" element={<CreateCasePage />} />
            <Route path="cases/:id" element={<CaseDetailsPage />} />
            <Route path="cases/:id/edit" element={<EditCasePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
