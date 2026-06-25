export type OfficerCaseStatus =
  | "NEW"
  | "VERIFYING"
  | "NEEDS_ADDITIONAL_EVIDENCE"
  | "RESOLVED"
  | "REJECTED"
  | "CLOSED";

export type OfficerCasePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type OfficerCaseReporterMode = "anonymous" | "identified";

export type OfficerCaseLock = {
  lockedById: string;
  lockedByName: string;
  expiresAt: string;
};

export type OfficerCaseEvidence = {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "pdf";
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
  code: string;
  title: string;
  summary: string;
  category: string;
  location: string;
  priority: OfficerCasePriority;
  status: OfficerCaseStatus;
  submittedAt: string;
  assignedOfficerName?: string;
  reporterMode: OfficerCaseReporterMode;
  reporter?: {
    fullName: string;
    citizenId: string;
    phone: string;
    address: string;
  };
  anonymousTemporaryId?: string;
  lock?: OfficerCaseLock;
  incident: {
    description: string;
    timeText: string;
    address: string;
    latitude?: string;
    longitude?: string;
    estimatedDamage?: string;
    relatedBank?: string;
  };
  evidence: OfficerCaseEvidence[];
  timeline: OfficerCaseTimelineItem[];
};
