import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { AuthContext } from "./AuthContextDef";
import { adminApi } from "@/api/adminApi";
import type { Admin, LoginCredentials, RegisterCredentials } from "@/types/admin.types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await adminApi.getMe();
        setAdmin(response.data.admin);
      } catch {
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await adminApi.login(credentials);
    setAdmin(response.data.admin);
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const response = await adminApi.register(credentials);
    setAdmin(response.data.admin);
  }, []);

  const logout = useCallback(async () => {
    await adminApi.logout();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ admin, isAuthenticated: !!admin, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
