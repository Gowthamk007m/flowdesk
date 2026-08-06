import axios from "axios";
import { notifyUnauthorized } from "@/features/auth/services/authEvents";
import { tokenService } from "@/features/auth/services/tokenService";

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

export default api;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenService.clearTokens();
            notifyUnauthorized();
        }

        return Promise.reject(error);
    }
);
