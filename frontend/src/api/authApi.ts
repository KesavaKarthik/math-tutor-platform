import { apiClient } from "./client";
import type { LoginResponse, User } from "@/types";

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", { username, password });
    return response.data;
  },
  register: async (username: string, password: string, class_level: string, board: string): Promise<User> => {
    const response = await apiClient.post("/auth/register", { username, password, class_level, board });
    return response.data;
  },
  getMe: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
