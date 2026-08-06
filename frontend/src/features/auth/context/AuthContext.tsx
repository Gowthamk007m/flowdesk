import {
  createContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  logout as logoutApi,
} from "../api/authApi";
import { AUTH_UNAUTHORIZED_EVENT } from "../services/authEvents";
import { tokenService } from "../services/tokenService";
import type { User } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: User | null;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
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
  const [isLoadingUser, setIsLoadingUser] = useState(
    tokenService.isAuthenticated()
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (!tokenService.isAuthenticated()) {
        setIsLoadingUser(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      tokenService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  async function login(access: string, refresh: string) {
    tokenService.setTokens(access, refresh);
    setIsAuthenticated(true);
    setUser(await getCurrentUser());
  }

  async function logout() {
    const refresh = tokenService.getRefreshToken();

    if (refresh) {
      await logoutApi(refresh).catch(() => undefined);
    }

    tokenService.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingUser,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
