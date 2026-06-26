export type CommanderReportStatus = {
  id: string;
  label: string;
  value: string;
  description?: string;
  tone: "total" | "new" | "verifying" | "investigating" | "resolved" | "spam";
};

export type CommanderRiskLevel = {
  label: string;
  percent: number;
  count: number;
  tone: "urgent" | "high" | "medium" | "low";
};

export type CommanderUrgentCase = {
  id: string;
  code: string;
  category: string;
  location: string;
  status: string;
  timeLabel: string;
};

export type CommanderActivity = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  tone: "new" | "verified" | "spam" | "report" | "broadcast";
};
