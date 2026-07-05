export type TrackingStatus =
  | "NEW_RECEIVED"
  | "UNDER_VERIFICATION"
  | "TRANSFERRED_TO_INVESTIGATION"
  | "RESOLVED"
  | "SPAM_OR_FAKE";

export type ReportStatusResponse = {
  trackingCode: string;
  status: TrackingStatus;
  displayStatus: string;
  createdAt: string;
  needsAdditionalEvidence?: boolean;
  evidenceRequests?: TrackingEvidenceRequest[];
};

export type TrackingEvidenceRequest = {
  id: number;
  caseId: number;
  originalFilename: string;
  contentType?: string | null;
  sizeBytes?: number | null;
  fileType?: string | null;
  checksumSha256?: string | null;
  uploadedAt: string;
  verificationStatus: "NEEDS_MORE_INFO" | string;
  verificationNote?: string | null;
  verifiedByUserId?: number | null;
  verifiedAt?: string | null;
};

export type TrackingTimelineState = "completed" | "current" | "pending";

export type TrackingTimelineItem = {
  id: string;
  title: string;
  description: string;
  occurredAt?: string;
  state: TrackingTimelineState;
};

export type TrackingCaseDetail = ReportStatusResponse & {
  timeline: TrackingTimelineItem[];
};
