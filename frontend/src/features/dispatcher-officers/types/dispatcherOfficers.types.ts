export type OfficerAvailabilityStatus =
  | "AVAILABLE"
  | "BUSY"
  | "ON_SCENE"
  | "OFF_DUTY";

export type OfficerShiftType = "MORNING" | "AFTERNOON" | "NIGHT";

export type OfficerStatusFilter = "ALL" | OfficerAvailabilityStatus;

export type OfficerShiftFilter = "ALL" | OfficerShiftType;

export type OfficerWorkloadFilter = "ALL" | "ZERO" | "ONE" | "MULTIPLE";

export type DispatcherOfficerAdvancedFilters = {
  status: OfficerStatusFilter;
  shift: OfficerShiftFilter;
  workload: OfficerWorkloadFilter;
};

export type DispatcherOfficer = {
  id: string;
  fullName: string;
  avatar?: string;
  initials: string;
  unitCode: string;
  badgeNumber: string;
  status: OfficerAvailabilityStatus;
  currentCaseCode?: string | null;
  activeCases: number;
  lastLocation: string;
  lastUpdated: string;
  shiftTime: string;
  shiftType: OfficerShiftType;
  phone: string;
};

export type OfficerStats = {
  total: number;
  available: number;
  busyOrOnScene: number;
  offDuty: number;
};
