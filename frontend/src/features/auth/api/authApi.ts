import api from "@/api/client";
import type { LoginRequest, TokenResponse, User } from "../types";

export async function login(data: LoginRequest) {
  const response = await api.post<TokenResponse>(
    "/auth/login/",
    data
  );

  return response.data;
}

export async function refreshToken(refresh: string) {
  const response = await api.post<TokenResponse>(
    "/auth/refresh/",
    { refresh }
  );

  return response.data;
}

export async function logout(refresh: string) {
  await api.post("/auth/logout/", { refresh });
}

export async function getCurrentUser() {
  const response = await api.get<User>("/auth/me/");

  return response.data;
}
