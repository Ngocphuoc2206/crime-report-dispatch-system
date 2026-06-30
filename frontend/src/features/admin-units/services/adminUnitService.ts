import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  AdminArea,
  AdminPoliceUnit,
  AdminUnitType,
} from "@/features/admin-units/types/adminUnit.types";

type AdminUnitApiItem = {
  id: number;
  code: string;
  name: string;
  areaId: number;
  areaName: string;
  address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  unitType: AdminUnitType;
  active: boolean;
};

type AdminAreaApiItem = {
  id: number;
  code: string;
  name: string;
  areaType: string;
};

function toUnit(item: AdminUnitApiItem): AdminPoliceUnit {
  return {
    id: String(item.id),
    code: item.code,
    name: item.name,
    areaId: String(item.areaId),
    areaName: item.areaName,
    address: item.address ?? "",
    latitude: item.latitude == null ? "" : String(item.latitude),
    longitude: item.longitude == null ? "" : String(item.longitude),
    unitType: item.unitType,
    active: item.active,
  };
}

function toArea(item: AdminAreaApiItem): AdminArea {
  return {
    id: String(item.id),
    code: item.code,
    name: item.name,
    areaType: item.areaType,
  };
}

function toPayload(unit: AdminPoliceUnit) {
  return {
    code: unit.code,
    name: unit.name,
    areaId: Number(unit.areaId),
    address: unit.address || null,
    latitude: unit.latitude ? Number(unit.latitude) : null,
    longitude: unit.longitude ? Number(unit.longitude) : null,
    unitType: unit.unitType,
    active: unit.active,
  };
}

export const adminUnitService = {
  async getUnits(): Promise<AdminPoliceUnit[]> {
    const response = await apiClient.get<AdminUnitApiItem[]>(endpoints.adminUnits, {
      auth: true,
    });

    return response.map(toUnit);
  },

  async getAreas(): Promise<AdminArea[]> {
    const response = await apiClient.get<AdminAreaApiItem[]>(endpoints.adminAreas, {
      auth: true,
    });

    return response.map(toArea);
  },

  async create(unit: AdminPoliceUnit): Promise<AdminPoliceUnit> {
    const response = await apiClient.post<AdminUnitApiItem, ReturnType<typeof toPayload>>(
      endpoints.adminUnits,
      toPayload(unit),
      { auth: true },
    );

    return toUnit(response);
  },
};
