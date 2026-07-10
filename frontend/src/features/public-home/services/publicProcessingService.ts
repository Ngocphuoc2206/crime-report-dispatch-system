import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { PublicProcessingFeed } from "@/features/public-home/types/publicHome.types";

export const publicProcessingService = {
  getFeed: () =>
    apiClient.get<PublicProcessingFeed>(endpoints.publicProcessingNotifications),
};
