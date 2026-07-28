import api from "@/api/client";
import type { LoginRequest, TokenResponse } from "../types";

export async function login(data: LoginRequest) {
    const response = await api.post<TokenResponse>(
        "/auth/login/",
        data
    );

    return response.data;
}