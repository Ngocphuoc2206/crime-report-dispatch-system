export type OfficerMetric = {
  id: string;
  label: string;
  value: string;
  description: string;
  trend?: string;
  trendTone?: "up" | "down" | "neutral";
};

export type PriorityCase = {
  id: string;
  code: string;
  title: string;
  description: string;
  timeLabel: string;
  level: "urgent" | "high";
};

export type UnitStatus = {
  id: string;
  unitName: string;
  current: number;
  total: number;
  tone: "navy" | "blue" | "green" | "red";
};

export type ActivityLog = {
  id: string;
  time: string;
  caseCode: string;
  action: string;
  actor: string;
  status: "received" | "verifying" | "resolved";
};

export type IntakeTrendPoint = {
  time: string;
  received: number;
  processed: number;
};
