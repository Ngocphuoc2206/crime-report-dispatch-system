import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  LoginFormState,
  LoginResult,
} from "@/features/auth/types/auth.types";

type LoginRequest = Pick<LoginFormState, "username" | "password">;

export const authService = {
  login: (form: LoginFormState): Promise<LoginResult> => {
    const payload: LoginRequest = {
      username: form.username.trim(),
      password: form.password,
    };

    return apiClient.post<LoginResult, LoginRequest>(endpoints.login, payload);
  },
};
