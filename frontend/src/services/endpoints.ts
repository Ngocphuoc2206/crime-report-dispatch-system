export const endpoints = {
  health: "/api/health",
  login: "/api/auth/login",

  // Crime-Types
  crimeTypes: "/api/public/crime-types",
  reports: "/api/public/reports",
  reportStatus: (trackingCode: string) =>
    `/api/public/reports/${encodeURIComponent(trackingCode)}/status`,
};
