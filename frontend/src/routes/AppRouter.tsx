import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout"; 
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import CasesPage from "../pages/CasesPage";
import CaseDetailsPage from "../pages/CaseDetailsPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<AppLayout />}>
                    <Route index element={<DashboardPage />} />

                    <Route path="cases" element={<CasesPage />} />

                    <Route path="cases/:id" element={<CaseDetailsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}