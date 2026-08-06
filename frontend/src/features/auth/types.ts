export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization: string | null;
  organization_name: string | null;
  department: string | null;
  department_name: string | null;
  role: string | null;
  role_name: string | null;
  is_verified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}
