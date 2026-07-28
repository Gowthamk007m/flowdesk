export interface User {
    id: string;
    email: string;
    full_name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface TokenResponse {
    access: string;
    refresh: string;
}