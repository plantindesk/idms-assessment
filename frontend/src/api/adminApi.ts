import API from "./axiosInstance";
import type { Admin, LoginCredentials, RegisterCredentials } from "@/types/admin.types";

interface AuthResponse {
  success: boolean;
  data: { admin: Admin };
  message: string;
}

export const adminApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await API.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await API.post<AuthResponse>("/auth/register", credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await API.post("/auth/logout");
  },

  getMe: async (): Promise<AuthResponse> => {
    const { data } = await API.get<AuthResponse>("/auth/me");
    return data;
  },
};
