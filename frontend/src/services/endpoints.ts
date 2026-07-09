export const endpoints = {
  health: "/api/health",
  login: "/api/auth/login",

  // Crime-Types
  crimeTypes: "/api/public/crime-types",
  publicProcessingNotifications: "/api/public/notifications/processing",
  reports: "/api/public/reports",
  reportStatus: (trackingCode: string) =>
    `/api/public/reports/${encodeURIComponent(trackingCode)}/status`,
  reportEvidences: (trackingCode: string) =>
    `/api/public/reports/${encodeURIComponent(trackingCode)}/evidences`,
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
  officerEvidenceDownload: (evidenceId: string | number) =>
    `/api/officer/evidences/${encodeURIComponent(String(evidenceId))}/download`,
  officerEvidenceVerification: (evidenceId: string | number) =>
    `/api/officer/evidences/${encodeURIComponent(String(evidenceId))}/verification`,

  commanderDashboardOverview: "/api/commander/dashboard/overview",
  commanderDashboardAnalytics: "/api/commander/dashboard/analytics",
  commanderDashboardHeatmap: "/api/commander/dashboard/heatmap",
  commanderDashboardTimeline: "/api/commander/dashboard/timeline",
  commanderCases: "/api/commander/cases",
  commanderCaseDetail: (trackingCode: string | number) =>
    `/api/commander/cases/${encodeURIComponent(String(trackingCode))}`,
  commanderCaseStatus: (trackingCode: string | number) =>
    `/api/commander/cases/${encodeURIComponent(String(trackingCode))}/status`,
  commanderEvidenceDownload: (evidenceId: string | number) =>
    `/api/commander/evidences/${encodeURIComponent(String(evidenceId))}/download`,
  commanderEvidenceVerification: (evidenceId: string | number) =>
    `/api/commander/evidences/${encodeURIComponent(String(evidenceId))}/verification`,
  commanderActivity: "/api/commander/activity",

  dispatchOfficerAvailability: "/api/dispatch/officers/availability",
  dispatchOfficersAvailable: "/api/dispatch/officers/available",
  dispatchCasesPending: "/api/dispatch/cases/pending",
  dispatchCaseDetail: (trackingCode: string | number) =>
    `/api/dispatch/cases/${encodeURIComponent(String(trackingCode))}`,
  dispatchCaseDispatch: (trackingCode: string | number) =>
    `/api/dispatch/cases/${encodeURIComponent(String(trackingCode))}/dispatch`,
  dispatchTasks: "/api/dispatch/tasks",
  dispatchTaskHistory: "/api/dispatch/tasks/history",
  dispatchTaskDetail: (taskId: string | number) =>
    `/api/dispatch/tasks/${encodeURIComponent(String(taskId))}`,
  dispatchTaskReassign: (taskId: string | number) =>
    `/api/dispatch/tasks/${encodeURIComponent(String(taskId))}/reassign`,
  dispatchTaskRecall: (taskId: string | number) =>
    `/api/dispatch/tasks/${encodeURIComponent(String(taskId))}/recall`,
  dispatchTaskStatus: (taskId: string | number) =>
    `/api/dispatch/tasks/${encodeURIComponent(String(taskId))}/status`,
  dispatchDashboardOverview: "/api/dispatch/dashboard/overview",
  dispatchDashboardPriorityQueue: "/api/dispatch/dashboard/priority-queue",
  dispatchDashboardActivity: "/api/dispatch/dashboard/activity",
  dispatchMapCases: "/api/dispatch/map/cases",
  dispatchMapUnits: "/api/dispatch/map/units",

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
  adminUnits: "/api/admin/units",
  adminUnitDetail: (unitId: string | number) =>
    `/api/admin/units/${encodeURIComponent(String(unitId))}`,
  adminAreas: "/api/admin/units/areas",
  adminOfficers: "/api/admin/officers",
  adminOfficerDetail: (officerId: string | number) =>
    `/api/admin/officers/${encodeURIComponent(String(officerId))}`,
};
