export type AdminAccountMetric = {
  id: string;
  label: string;
  value: string;
  tone:
    | "default"
    | "success"
    | "danger"
    | "officer"
    | "dispatcher"
    | "commander"
    | "admin";
};

export type AdminReportMetric = {
  id: string;
  label: string;
  value: string;
  description?: string;
  tone: "primary" | "default" | "success" | "danger";
};

export type AdminRecentUser = {
  id: string;
  username: string;
  fullName: string;
  role: "OFFICER" | "DISPATCHER" | "COMMANDER" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "LOCKED";
  createdAt: string;
};
