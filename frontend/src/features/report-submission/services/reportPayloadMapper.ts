import type {
  ReporterIdentityDraft,
  ReporterIdentityPayload,
} from "@/features/report-submission/types/reportSubmission.types";

export function toReporterIdentityPayload(
  draft: ReporterIdentityDraft,
): ReporterIdentityPayload {
  if (draft.mode === "anonymous") {
    return {
      reporterFullName: null,
      reporterCitizenId: null,
      reporterPhone: null,
      reporterEmail: null,
      reporterAddress: null,
    };
  }

  return {
    reporterFullName: draft.fullName.trim() || null,
    reporterCitizenId: draft.citizenId.trim() || null,
    reporterPhone: draft.phone.trim() || null,
    reporterEmail: draft.email.trim() || null,
    reporterAddress: draft.address.trim() || null,
  };
}
