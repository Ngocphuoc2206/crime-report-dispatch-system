export type AlertTone = "danger" | "warning" | "info" | "success";

export type SecurityAlert = {
  id: string;
  level: string;
  title: string;
  summary: string;
  time: string;
  date: string;
  tone: AlertTone;
};

export type LegalHelpItem = {
  id: string;
  title: string;
  description: string;
  icon: "book" | "shield-search" | "shield";
};

export type TrustMetric = {
  id: string;
  value: string;
  label: string;
};

export type PublicProcessingUpdate = {
  id: number;
  type: "CASE_DISPATCHED" | "CASE_REASSIGNED" | "DISPATCH_RECALLED" | string;
  title: string;
  message: string;
  createdAt: string;
};

export type PublicProcessingFeed = {
  updatesLast24Hours: number;
  headline: string;
  summary: string;
  safetyTips: string[];
  latestUpdates: PublicProcessingUpdate[];
};
