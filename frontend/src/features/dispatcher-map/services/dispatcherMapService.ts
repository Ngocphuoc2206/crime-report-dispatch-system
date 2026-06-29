import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  DispatcherMapCase,
  DispatcherMapPriority,
  DispatcherMapStatus,
} from "@/features/dispatcher-map/types/dispatcherMap.types";

type DispatchMapCaseApiItem = {
  caseId: number;
  latitude: number | string;
  longitude: number | string;
  urgencyLevel: DispatcherMapPriority;
  title: string;
  status: string;
  trackingCode: string;
  address: string | null;
};

function toPercent(value: number | string, fallback: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;

  const normalized = Math.abs(numeric % 100);
  return Math.min(92, Math.max(8, normalized));
}

function statusFromBackend(status: string): DispatcherMapStatus {
  if (status === "RESOLVED") return "RESOLVED";
  if (status === "TRANSFERRED_TO_INVESTIGATION") return "ON_SCENE";
  if (status === "UNDER_VERIFICATION") return "DISPATCHED";
  return "PENDING";
}

function toMapCase(item: DispatchMapCaseApiItem, index: number): DispatcherMapCase {
  return {
    id: String(item.caseId),
    caseCode: item.trackingCode,
    title: item.title,
    type: item.title,
    priority: item.urgencyLevel,
    status: statusFromBackend(item.status),
    location: item.address || `${item.latitude}, ${item.longitude}`,
    district: "Khu vuc tu ban do",
    reportedAt: "--",
    lat: toPercent(item.latitude, 18 + index * 13),
    lng: toPercent(item.longitude, 22 + index * 17),
    nearestUnit: "Dang tinh toan",
    eta: "--",
    description: `Tin bao ${item.title} duoc ghi nhan tren ban do dieu phoi.`,
  };
}

export const dispatcherMapService = {
  async getCases(): Promise<DispatcherMapCase[]> {
    const response = await apiClient.get<DispatchMapCaseApiItem[]>(
      endpoints.dispatchMapCases,
      { auth: true },
    );

    return response.map(toMapCase);
  },
};
