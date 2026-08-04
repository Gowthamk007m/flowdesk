import api from "@/api/client";


import type { DashboardStats } from "../types";

export async function getDashboard() {
    const response = await api.get<DashboardStats>(
        "/cases/dashboard/"
    );

    return response.data;
}