import type {
  EvidenceUploadDraft,
  IncidentInformationDraft,
  ReportClassificationDraft,
  ReporterIdentityDraft,
} from "@/features/report-submission/types/reportSubmission.types";

const REPORT_CLASSIFICATION_DRAFT_KEY = "reportClassificationDraft";
const REPORTER_IDENTITY_DRAFT_KEY = "reporterIdentityDraft";
const INCIDENT_INFORMATION_DRAFT_KEY = "incidentInformationDraft";
const EVIDENCE_UPLOAD_DRAFT_KEY = "evidenceUploadDraft";

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

function isReporterIdentityDraft(
  value: unknown,
): value is ReporterIdentityDraft {
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

function isIncidentInformationDraft(
  value: unknown,
): value is IncidentInformationDraft {
  if (typeof value !== "object" || value === null) return false;

  const draft = value as Record<string, unknown>;

  return (
    typeof draft.description === "string" &&
    typeof draft.incidentTime === "string" &&
    typeof draft.timeUnknown === "boolean" &&
    typeof draft.address === "string" &&
    typeof draft.latitude === "string" &&
    typeof draft.longitude === "string" &&
    typeof draft.estimatedCrimeType === "string" &&
    typeof draft.isHappeningNow === "boolean" &&
    typeof draft.hasWeapon === "boolean" &&
    typeof draft.hasInjured === "boolean" &&
    Array.isArray(draft.tags) &&
    draft.tags.every((tag) => typeof tag === "string")
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

  // Step 2
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

  // Step 3
  saveIncidentInformation: (draft: IncidentInformationDraft) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      INCIDENT_INFORMATION_DRAFT_KEY,
      JSON.stringify(draft),
    );
  },

  getIncidentInformation: (): IncidentInformationDraft | null => {
    if (typeof window === "undefined") return null;

    const rawValue = sessionStorage.getItem(INCIDENT_INFORMATION_DRAFT_KEY);

    if (!rawValue) return null;

    try {
      const parsedValue: unknown = JSON.parse(rawValue);

      if (!isIncidentInformationDraft(parsedValue)) {
        sessionStorage.removeItem(INCIDENT_INFORMATION_DRAFT_KEY);
        return null;
      }

      return parsedValue;
    } catch {
      sessionStorage.removeItem(INCIDENT_INFORMATION_DRAFT_KEY);
      return null;
    }
  },

  clearIncidentInformation: () => {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(INCIDENT_INFORMATION_DRAFT_KEY);
  },
  // Step 4

  saveEvidenceUpload: (draft: EvidenceUploadDraft) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(EVIDENCE_UPLOAD_DRAFT_KEY, JSON.stringify(draft));
  },

  getEvidenceUpload: (): EvidenceUploadDraft | null => {
    if (typeof window === "undefined") return null;

    const rawValue = sessionStorage.getItem(EVIDENCE_UPLOAD_DRAFT_KEY);

    if (!rawValue) return null;

    try {
      return JSON.parse(rawValue) as EvidenceUploadDraft;
    } catch {
      return null;
    }
  },

  clearEvidenceUpload: () => {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(EVIDENCE_UPLOAD_DRAFT_KEY);
  },
};
