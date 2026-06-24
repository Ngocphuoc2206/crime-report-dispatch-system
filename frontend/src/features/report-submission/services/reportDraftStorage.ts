import type {
  ReportClassificationDraft,
  ReporterIdentityDraft,
} from "@/features/report-submission/types/reportSubmission.types";

const REPORT_CLASSIFICATION_DRAFT_KEY = "reportClassificationDraft";
const REPORTER_IDENTITY_DRAFT_KEY = "reporterIdentityDraft";

function isReportClassificationDraft(
  value: unknown,
): value is ReportClassificationDraft {
  if (typeof value !== "object" || value === null) return false;

  const draft = value as Record<string, unknown>;

  return (
    typeof draft.crimeTypeId === "string" &&
    typeof draft.crimeTypeCode === "string" &&
    typeof draft.crimeTypeName === "string" &&
    typeof draft.anonymous === "boolean"
  );
}

function isReporterIdentityDraft(value: unknown): value is ReporterIdentityDraft {
  if (typeof value !== "object" || value === null) return false;

  const draft = value as Record<string, unknown>;

  return (
    (draft.mode === "anonymous" || draft.mode === "identified") &&
    typeof draft.fullName === "string" &&
    typeof draft.citizenId === "string" &&
    typeof draft.phone === "string" &&
    typeof draft.email === "string" &&
    typeof draft.address === "string" &&
    typeof draft.privacyAccepted === "boolean"
  );
}

export const reportDraftStorage = {
  saveClassification: (draft: ReportClassificationDraft) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      REPORT_CLASSIFICATION_DRAFT_KEY,
      JSON.stringify(draft),
    );
  },

  getClassification: (): ReportClassificationDraft | null => {
    if (typeof window === "undefined") return null;

    const rawValue = sessionStorage.getItem(REPORT_CLASSIFICATION_DRAFT_KEY);

    if (!rawValue) return null;

    try {
      const parsedValue: unknown = JSON.parse(rawValue);

      if (!isReportClassificationDraft(parsedValue)) {
        sessionStorage.removeItem(REPORT_CLASSIFICATION_DRAFT_KEY);
        return null;
      }

      return parsedValue;
    } catch {
      sessionStorage.removeItem(REPORT_CLASSIFICATION_DRAFT_KEY);
      return null;
    }
  },

  clearClassification: () => {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(REPORT_CLASSIFICATION_DRAFT_KEY);
  },

  saveReporterIdentity: (draft: ReporterIdentityDraft) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(REPORTER_IDENTITY_DRAFT_KEY, JSON.stringify(draft));
  },

  getReporterIdentity: (): ReporterIdentityDraft | null => {
    if (typeof window === "undefined") return null;

    const rawValue = sessionStorage.getItem(REPORTER_IDENTITY_DRAFT_KEY);

    if (!rawValue) return null;

    try {
      const parsedValue: unknown = JSON.parse(rawValue);

      if (!isReporterIdentityDraft(parsedValue)) {
        sessionStorage.removeItem(REPORTER_IDENTITY_DRAFT_KEY);
        return null;
      }

      return parsedValue;
    } catch {
      sessionStorage.removeItem(REPORTER_IDENTITY_DRAFT_KEY);
      return null;
    }
  },

  clearReporterIdentity: () => {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(REPORTER_IDENTITY_DRAFT_KEY);
  },
};
