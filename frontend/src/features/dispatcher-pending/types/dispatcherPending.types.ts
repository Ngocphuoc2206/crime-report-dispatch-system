export type PendingDispatchPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type PendingDispatchStatus =
  | "UNASSIGNED"
  | "HELD"
  | "TIME_LIMIT"
  | "ASSIGNED";

export type RecommendedUnitStatus = "READY" | "BUSY" | "OFFLINE";

export type PendingDispatchCase = {
  id: string;
  caseCode: string;
  title: string;
  type: string;
  priority: PendingDispatchPriority;
  location: string;
  district: string;
  distanceToUnit: string;
  waitTime: string;
  createdAt: string;
  status: PendingDispatchStatus;
  suggestedUnit: string;
  description: string;
  reporterType: "Ẩn danh" | "Định danh";
  evidenceCount: number;
};

export type RecommendedDispatchUnit = {
  id: string;
  unitCode: string;
  unitName: string;
  officers: string;
  eta: string;
  distance: string;
  matchRate: number;
  status: RecommendedUnitStatus;
};
