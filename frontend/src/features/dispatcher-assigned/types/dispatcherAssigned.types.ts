export type AssignedCasePriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type AssignedCaseStatus =
  | "DISPATCHED"
  | "ACKNOWLEDGED"
  | "ON_SITE"
  | "NEED_SUPPORT"
  | "RESOLVED";

export type AssignedCase = {
  id: string;
  caseCode: string;
  title: string;
  priority: AssignedCasePriority;
  location: string;
  assignedUnit: string;
  assignedOfficer: string;
  assignedAt: string;
  eta: string;
  slaRemaining: string;
  status: AssignedCaseStatus;
};

export type ReassignUnitOption = {
  id: string;
  unitId?: number;
  officerId?: number;
  unitCode: string;
  unitName: string;
  officerName?: string;
  status: "READY" | "BUSY";
  eta: string;
  distance: string;
};
