import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";

export interface HealthResponse {
  status?: string;
  message?: string;
}

export const healthService = {
  check: () => {
    return apiClient.get<HealthResponse>(endpoints.health);
  },
};
