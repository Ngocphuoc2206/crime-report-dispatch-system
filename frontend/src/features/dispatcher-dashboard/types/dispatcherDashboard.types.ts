export type DispatchMetricTone = "default" | "danger" | "warning" | "success";

export type DispatchMetric = {
  id: string;
  label: string;
  value: string;
  description: string;
  tone: DispatchMetricTone;
};

export type DispatchPriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type DispatchSpamLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH";

export type DispatchCaseStatus =
  | "WAITING_DISPATCH"
  | "DISPATCHED"
  | "IN_PROGRESS"
  | "RESOLVED";

export type DispatchPriorityCase = {
  id: string;
  caseCode: string;
  type: string;
  priority: DispatchPriorityLevel;
  location: string;
  createdAt: string;
  waitingTime: string;
  spamScore?: number | null;
  spamLevel?: DispatchSpamLevel | null;
  spamReasons?: string | null;
};

export type DispatchOfficerStatus = "AVAILABLE" | "BUSY" | "OFFLINE";

export type DispatchOfficerUnit = {
  id: string;
  unitCode: string;
  name: string;
  zone: string;
  role: string;
  status: DispatchOfficerStatus;
  currentCaseCode?: string;
  distanceToCenter: string;
};

export type DispatchActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "danger" | "info" | "success" | "warning";
};
