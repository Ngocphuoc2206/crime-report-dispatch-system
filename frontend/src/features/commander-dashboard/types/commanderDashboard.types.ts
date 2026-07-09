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

export type CommanderMapSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CommanderDashboardOverview = {
  totalReports: number;
  newReports: number;
  underVerificationReports: number;
  transferredReports: number;
  resolvedReports: number;
  spamReports: number;
  criticalReports: number;
  highReports: number;
  mediumReports: number;
  lowReports: number;
};

export type CommanderMapHeatmapPoint = {
  caseId: number;
  latitude: number | string;
  longitude: number | string;
  urgencyLevel: CommanderMapSeverity;
  crimeTypeName: string;
  status: string;
  createdAt: string;
};

export type CommanderDashboardTimelineEvent = {
  caseId: number;
  trackingCode: string;
  event: string;
  description: string;
  urgencyLevel: CommanderMapSeverity;
  createdAt: string;
};

export type CommanderMonthlyReportTrend = {
  year: number;
  month: number;
  label: string;
  reportCount: number;
  forecast: boolean;
};

export type CommanderCrimeAnalytics = {
  monthlyTrend: CommanderMonthlyReportTrend[];
  changePercent: number | null;
  trendDirection: "UP" | "DOWN" | "STABLE";
  forecastReportCount: number;
  forecastMethod: "LINEAR_REGRESSION";
};
