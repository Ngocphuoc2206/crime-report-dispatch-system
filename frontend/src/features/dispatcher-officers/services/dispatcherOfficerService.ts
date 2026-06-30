import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  DispatcherOfficer,
  OfficerAvailabilityStatus,
  OfficerShiftType,
} from "@/features/dispatcher-officers/types/dispatcherOfficers.types";

type ApiAvailabilityStatus = "AVAILABLE" | "BUSY" | "ON_SCENE" | "OFF_DUTY";

type OfficerAvailabilityApiItem = {
  officerId: number;
  userId: number;
  badgeNumber: string;
  rankName: string | null;
  unitId: number;
  unitName: string;
  shiftId: number | null;
  shiftCode: string | null;
  shiftName: string | null;
  availabilityStatus: ApiAvailabilityStatus;
  currentCaseId: number | null;
  shiftStartAt: string | null;
  shiftEndAt: string | null;
  lastStatusAt: string | null;
};

function formatTime(value: string | null) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAgo(value: string | null) {
  if (!value) return "Chua cap nhat";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs)) return value;
  if (diffMs < 60_000) return "Vua xong";

  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `${diffMinutes} phut truoc`;

  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours} gio truoc`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getShiftType(startAt: string | null): OfficerShiftType {
  if (!startAt) return "MORNING";

  const hour = new Date(startAt).getHours();
  if (hour >= 6 && hour < 12) return "MORNING";
  if (hour >= 12 && hour < 20) return "AFTERNOON";
  return "NIGHT";
}

function toOfficer(item: OfficerAvailabilityApiItem): DispatcherOfficer {
  const name = item.rankName
    ? `${item.rankName} #${item.officerId}`
    : `Can bo #${item.officerId}`;
  const shiftStart = formatTime(item.shiftStartAt);
  const shiftEnd = formatTime(item.shiftEndAt);

  return {
    id: String(item.officerId),
    fullName: name,
    initials: getInitials(name),
    unitCode: item.unitName || `Unit #${item.unitId}`,
    badgeNumber: item.badgeNumber,
    status: item.availabilityStatus as OfficerAvailabilityStatus,
    currentCaseCode: item.currentCaseId ? `CASE-${item.currentCaseId}` : null,
    activeCases: item.currentCaseId ? 1 : 0,
    lastLocation: item.unitName || "Chua cap nhat don vi",
    lastUpdated: formatAgo(item.lastStatusAt),
    shiftTime: `${shiftStart} - ${shiftEnd}`,
    shiftType: getShiftType(item.shiftStartAt),
    phone: "Chua cap nhat",
  };
}

export const dispatcherOfficerService = {
  async getAvailability(): Promise<DispatcherOfficer[]> {
    const response = await apiClient.get<OfficerAvailabilityApiItem[]>(
      endpoints.dispatchOfficerAvailability,
      { auth: true },
    );

    return response.map(toOfficer);
  },
};
