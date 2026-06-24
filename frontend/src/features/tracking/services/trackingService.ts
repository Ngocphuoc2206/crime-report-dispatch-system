import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { ReportStatusResponse } from "@/features/tracking/types/tracking.types";

export const trackingService = {
  getStatus: (trackingCode: string) =>
    apiClient.get<ReportStatusResponse>(endpoints.reportStatus(trackingCode)),
};
