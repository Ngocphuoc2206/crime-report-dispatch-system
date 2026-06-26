export const endpoints = {
  health: "/api/health",
  login: "/api/auth/login",

  // Crime-Types
  crimeTypes: "/api/public/crime-types",
  reports: "/api/public/reports",
  reportStatus: (trackingCode: string) =>
    `/api/public/reports/${encodeURIComponent(trackingCode)}/status`,
  officerAuditLogs: "/api/officer/audit-logs",
  officerCases: "/api/officer/cases",
  officerMyCases: "/api/officer/cases/mine",
  officerCaseDetail: (caseId: string | number) =>
    `/api/officer/cases/${encodeURIComponent(String(caseId))}`,
  officerCaseAccept: (caseId: string | number) =>
    `/api/officer/cases/${encodeURIComponent(String(caseId))}/accept`,
  officerCaseStatus: (caseId: string | number) =>
    `/api/officer/cases/${encodeURIComponent(String(caseId))}/status`,
  officerCaseLock: (caseId: string | number) =>
    `/api/officer/cases/${encodeURIComponent(String(caseId))}/lock`,
  officerCaseLockRenew: (caseId: string | number) =>
    `/api/officer/cases/${encodeURIComponent(String(caseId))}/lock/renew`,

  commanderDashboardOverview: "/api/commander/dashboard/overview",
  commanderDashboardHeatmap: "/api/commander/dashboard/heatmap",
  commanderDashboardTimeline: "/api/commander/dashboard/timeline",
  commanderCases: "/api/commander/cases",
  commanderCaseDetail: (trackingCode: string | number) =>
    `/api/commander/cases/${encodeURIComponent(String(trackingCode))}`,
  commanderCaseStatus: (trackingCode: string | number) =>
    `/api/commander/cases/${encodeURIComponent(String(trackingCode))}/status`,
  commanderActivity: "/api/commander/activity",

  adminUrgencyRules: "/api/admin/urgency-rules",
  adminUrgencyRuleDetail: (ruleId: string | number) =>
    `/api/admin/urgency-rules/${encodeURIComponent(String(ruleId))}`,
  adminUsers: "/api/admin/users",
  adminUserRoles: (userId: string | number) =>
    `/api/admin/users/${encodeURIComponent(String(userId))}/roles`,
  adminUserStatus: (userId: string | number) =>
    `/api/admin/users/${encodeURIComponent(String(userId))}/status`,
  adminCrimeTypes: "/api/admin/crime-types",
  adminCrimeTypeDetail: (crimeTypeId: string | number) =>
    `/api/admin/crime-types/${encodeURIComponent(String(crimeTypeId))}`,
  adminOfficers: "/api/admin/officers",
  adminOfficerDetail: (officerId: string | number) =>
    `/api/admin/officers/${encodeURIComponent(String(officerId))}`,
};
