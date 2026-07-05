export type KnownAuditActionType =
  | "CASE_CREATED"
  | "CASE_ASSIGNED"
  | "CASE_ACCEPTED"
  | "CASE_LOCKED"
  | "CASE_UNLOCKED"
  | "CASE_STATUS_CHANGED"
  | "REPORTER_IDENTITY_ENCRYPTED"
  | "REPORTER_IDENTITY_DECRYPTED"
  | "URGENCY_SCORE_CALCULATED"
  | "AI_SPAM_ANALYZED"
  | "CASE_MARKED_SPAM_OR_FAKE"
  | "CASE_MARKED_NEEDS_REVIEW";

export type AuditActionType = KnownAuditActionType | (string & {});

export type AuditActionFilter = "ALL" | AuditActionType;

export type AuditLogItem = {
  id: number;
  occurredAt: string;
  actorUserId?: number | null;
  actorRole?: string | null;
  accountName: string;
  accountCode: string;
  actionType: AuditActionType;
  resourceType: string;
  resourceId: number;
  targetCode?: string | null;
  note: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  detail?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
};

export type OfficerAuditLogApiItem = {
  id: number;
  occurredAt: string;
  actorUserId?: number | null;
  actorRole?: string | null;
  action: AuditActionType;
  resourceType: string;
  resourceId: number;
  resourceCode?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  note?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  detail?: string | null;
};

export type ApiPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};
