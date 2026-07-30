import {
    createContext,
    type ReactNode,
    useState,
} from "react";

import { tokenService } from "../services/tokenService";

interface AuthContextType {
    isAuthenticated: boolean;

    login: (access: string, refresh: string) => void;

    logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        tokenService.isAuthenticated()
    );

    function login(access: string, refresh: string) {
        tokenService.setTokens(access, refresh);

        setIsAuthenticated(true);
    }

    function logout() {
        tokenService.clearTokens();

        setIsAuthenticated(false);
    }

    return (
    <AuthContext.Provider
        value={{
        isAuthenticated,
        login,
        logout,
        }}
    >
        {children}
    </AuthContext.Provider>
    );
}
