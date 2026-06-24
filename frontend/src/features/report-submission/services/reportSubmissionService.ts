import type {
  SubmitReportPayload,
  SubmittedReportResult,
} from "@/features/report-submission/types/reportSubmission.types";
import { toCreateReportPayload } from "@/features/report-submission/services/reportPayloadMapper";
import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";

type CreateReportResponse = {
  caseId: number;
  trackingCode: string;
  status: string;
  urgencyScore: number;
  urgencyLevel: string;
  message: string;
};

export const reportSubmissionService = {
  submitReport: async (
    payload: SubmitReportPayload,
  ): Promise<SubmittedReportResult> => {
    const report = toCreateReportPayload(
      payload.classification,
      payload.reporter,
      payload.incident,
    );
    const formData = new FormData();

    formData.append("report", JSON.stringify(report));
    payload.files.forEach((file) => {
      formData.append("files", file, file.name);
    });

    const response = await apiClient.postForm<CreateReportResponse>(
      endpoints.reports,
      formData,
    );

    return {
      caseId: response.caseId,
      trackingCode: response.trackingCode,
      submittedAt: new Date().toISOString(),
      status: response.status,
      urgencyScore: response.urgencyScore,
      urgencyLevel: response.urgencyLevel,
      mode: payload.reporter.mode,
    };
  },
};
