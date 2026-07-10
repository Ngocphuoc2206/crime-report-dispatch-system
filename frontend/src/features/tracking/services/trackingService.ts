import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { ReportStatusResponse } from "@/features/tracking/types/tracking.types";

export const trackingService = {
  async getStatus(trackingCode: string) {
    const response = await apiClient.get<ReportStatusResponse>(
      endpoints.reportStatus(trackingCode),
    );

    return {
      ...response,
      evidenceRequests: response.evidenceRequests?.map((request) => ({
        ...request,
        originalFilename: request.title,
        uploadedAt: request.createdAt,
        verifiedAt: request.createdAt,
        verificationNote: request.message,
      })),
    };
  },

  uploadSupplementalEvidence: (trackingCode: string, files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => formData.append("files", file, file.name));

    return apiClient.postForm<{ trackingCode: string }>(
      endpoints.reportEvidences(trackingCode),
      formData,
    );
  },
};
