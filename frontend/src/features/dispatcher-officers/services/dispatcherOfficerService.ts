import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  DispatcherOfficer,
  OfficerAvailabilityStatus,
  OfficerShiftType,
} from "@/features/dispatcher-officers/types/dispatcherOfficers.types";
import {
  formatVietnamTime,
  getBackendDateTimeMs,
  parseBackendDateTime,
} from "@/utils/dateTime";

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
  return formatVietnamTime(value);
}

function formatAgo(value: string | null) {
  if (!value) return "Chua cap nhat";

  const diffMs = Date.now() - getBackendDateTimeMs(value);

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

  const parsedStartAt = parseBackendDateTime(startAt);
  if (!parsedStartAt) return "MORNING";

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Bangkok",
    }).format(parsedStartAt),
  );
  if (hour >= 6 && hour < 12) return "MORNING";
  if (hour >= 12 && hour < 20) return "AFTERNOON";
  return "NIGHT";
}

function getTimestamp(value: string | null) {
  if (!value) return 0;

  const time = getBackendDateTimeMs(value);
  return Number.isNaN(time) ? 0 : time;
}

function dedupeAvailability(items: OfficerAvailabilityApiItem[]) {
  const byOfficerId = new Map<number, OfficerAvailabilityApiItem>();

  items.forEach((item) => {
    const current = byOfficerId.get(item.officerId);

    if (!current) {
      byOfficerId.set(item.officerId, item);
      return;
    }

    if (getTimestamp(item.lastStatusAt) >= getTimestamp(current.lastStatusAt)) {
      byOfficerId.set(item.officerId, item);
    }
  });

  return Array.from(byOfficerId.values()).sort(
    (left, right) => left.officerId - right.officerId,
  );
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

    return dedupeAvailability(response).map(toOfficer);
  },
};
