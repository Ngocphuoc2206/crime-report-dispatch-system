export type CommanderMapSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CommanderMapReport = {
  id: string;
  code: string;
  title: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  district: string;
  severity: CommanderMapSeverity;
  status: string;
  reportedAt: string;
  x: number;
  y: number;
};

export type CommanderMapFilter = {
  region: string;
  severity: "ALL" | CommanderMapSeverity;
  fromDate: string;
  toDate: string;
};
