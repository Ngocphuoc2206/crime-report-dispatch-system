import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { ReportStatusResponse } from "@/features/tracking/types/tracking.types";

export const trackingService = {
  getStatus: (trackingCode: string) =>
    apiClient.get<ReportStatusResponse>(endpoints.reportStatus(trackingCode)),

  uploadSupplementalEvidence: (trackingCode: string, files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => formData.append("files", file, file.name));

    return apiClient.postForm<{ trackingCode: string }>(
      endpoints.reportEvidences(trackingCode),
      formData,
    );
  },
};
