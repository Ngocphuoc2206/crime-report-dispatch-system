export type OfficerCaseStatus =
  | "NEW_RECEIVED"
  | "UNDER_VERIFICATION"
  | "TRANSFERRED_TO_INVESTIGATION"
  | "RESOLVED"
  | "SPAM_OR_FAKE";

export type OfficerCasePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type OfficerCaseReporterMode = "anonymous" | "identified";

export type OfficerCaseLock = {
  caseId: number;
  lockedByUserId?: number | null;
  lockedByOfficerId?: number | null;
  lockedByUnitId?: number | null;
  caseLockStatus?: string | null;
  lockedAt?: string | null;
  expiresAt?: string | null;
  lockedByMe: boolean;
  active: boolean;
};

export type OfficerCaseEvidence = {
  id: number;
  caseId: number;
  name: string;
  contentType?: string | null;
  type: string;
  size: string;
  uploadedAt: string;
};

export type OfficerCaseTimelineItem = {
  id: string;
  title: string;
  description: string;
  actor: string;
  occurredAt: string;
};

export type OfficerCase = {
  id: number;
  code: string;
  title: string;
  summary: string;
  category: string;
  location: string;
  priority: OfficerCasePriority;
  status: OfficerCaseStatus;
  submittedAt: string;
  updatedAt?: string;
  assignedUnitId?: number | null;
  assignedOfficerId?: number | null;
  assignedOfficerName?: string;
  reporterMode: OfficerCaseReporterMode;
  anonymousTemporaryId?: string;
  lock?: OfficerCaseLock | null;
  incident: {
    description: string;
    timeText: string;
    address: string;
    latitude?: string;
    longitude?: string;
  };
  evidence: OfficerCaseEvidence[];
  timeline: OfficerCaseTimelineItem[];
};

export type OfficerCaseApiItem = {
  id: number;
  trackingCode: string;
  title: string;
  description: string;
  status: OfficerCaseStatus;
  urgencyLevel: OfficerCasePriority;
  latitude?: number | string | null;
  longitude?: number | string | null;
  address?: string | null;
  assignedUnitId?: number | null;
  assignedOfficerId?: number | null;
  createdAt: string;
  updatedAt?: string | null;
};

export type OfficerCaseDetailApiItem = {
  id: number;
  trackingCode: string;
  description: string;
  crimeType: string;
  status: OfficerCaseStatus;
  urgencyLevel: OfficerCasePriority;
  latitude?: number | string | null;
  longitude?: number | string | null;
  address?: string | null;
  assignedUnitId?: number | null;
  assignedOfficerId?: number | null;
  anonymous: boolean;
  createdAt: string;
  updatedAt?: string | null;
  evidences: OfficerCaseEvidenceApiItem[];
};

export type OfficerCaseEvidenceApiItem = {
  id: number;
  caseId: number;
  originalFilename: string;
  contentType?: string | null;
  sizeBytes?: number | null;
  fileType?: string | null;
  checksumSha256?: string | null;
  uploadedAt: string;
};

export type OfficerCasePage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type AcceptCaseResponse = {
  caseId: number;
  trackingCode: string;
  caseStatus: OfficerCaseStatus;
  assignedUnitId?: number | null;
  assignedOfficerId?: number | null;
  lockResponse: OfficerCaseLock;
};

export type UpdateCaseStatusResponse = {
  caseId: number;
  trackingCode: string;
  oldStatus: OfficerCaseStatus;
  newStatus: OfficerCaseStatus;
  note?: string | null;
  updatedAt: string;
};
