import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { notifyUnauthorized } from "@/features/auth/services/authEvents";
import { tokenService } from "@/features/auth/services/tokenService";
import type { TokenResponse } from "@/features/auth/types";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const refresh = tokenService.getRefreshToken();

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      refresh
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<TokenResponse>(
          `${import.meta.env.VITE_API_URL}/auth/refresh/`,
          { refresh }
        );

        tokenService.setTokens(response.data.access, response.data.refresh);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        tokenService.clearTokens();
        notifyUnauthorized();

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      tokenService.clearTokens();
      notifyUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;
