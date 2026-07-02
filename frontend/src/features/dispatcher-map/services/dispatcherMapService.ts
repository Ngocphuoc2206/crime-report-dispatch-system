import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  DispatcherMapCase,
  DispatcherMapPriority,
  DispatcherMapStatus,
  DispatcherMapUnit,
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

type DispatchMapUnitApiItem = {
  unitId: number;
  unitCode: string;
  unitName: string;
  status: DispatcherMapUnit["status"];
  address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
};

function toCoordinate(value: number | string | null, fallback: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return numeric;
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
    lat: toCoordinate(item.latitude, 10.7769 + index * 0.01),
    lng: toCoordinate(item.longitude, 106.7009 + index * 0.01),
    nearestUnit: "Dang tinh toan",
    eta: "--",
    description: `Tin bao ${item.title} duoc ghi nhan tren ban do dieu phoi.`,
  };
}

function toMapUnit(item: DispatchMapUnitApiItem, index: number): DispatcherMapUnit {
  return {
    id: String(item.unitId),
    unitCode: item.unitCode,
    unitName: item.unitName,
    status: item.status,
    location: item.address || "Chua cap nhat vi tri",
    lat: toCoordinate(item.latitude, 10.7769 + index * 0.012),
    lng: toCoordinate(item.longitude, 106.7009 + index * 0.012),
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

  async getUnits(): Promise<DispatcherMapUnit[]> {
    const response = await apiClient.get<DispatchMapUnitApiItem[]>(
      endpoints.dispatchMapUnits,
      { auth: true },
    );

    return response.map(toMapUnit);
  },
};
