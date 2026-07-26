import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout"; 

import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import CasesPage from "../pages/CasesPage";
import CaseDetailsPage from "../pages/CaseDetailsPage";

export default function AppRouter() {
    return (
   <BrowserRouter>
            <Route path="/" element={ <AppLayout> <DashboardPage /> </AppLayout> } />
            <Routes> <Route path="/login" element={<LoginPage />} />
            <Route path="/cases" element={ <AppLayout> <CasesPage /> </AppLayout> } />
            <Route path="/cases/:id" element={ <AppLayout> <CaseDetailsPage /> </AppLayout> } /> </Routes>
        
        </BrowserRouter>
    );
}