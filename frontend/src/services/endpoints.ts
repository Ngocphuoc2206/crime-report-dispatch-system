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
};
