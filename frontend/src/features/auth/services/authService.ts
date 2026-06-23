import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const authService = {
  login: (payload: LoginRequest) => {
    return apiClient.post<LoginResponse, LoginRequest>(
      endpoints.login,
      payload,
    );
  },
};
