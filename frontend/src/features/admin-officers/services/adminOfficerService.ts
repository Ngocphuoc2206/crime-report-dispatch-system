import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { AdminOfficerProfile } from "@/features/admin-officers/types/adminOfficer.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

type AdminOfficerApiItem = {
  id: number;
  userId: number;
  unitId: number;
  unitName: string;
  badgeNumber: string;
  rankName: string;
  officerStatus: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  createdAt: string | null;
  updatedAt: string | null;
};

type CreateOfficerResponse = {
  officerId: number;
  userId: number;
  unitId: number;
  unitName: string;
  badgeNumber: string;
  rankName: string;
};

function toOfficer(item: AdminOfficerApiItem | CreateOfficerResponse): AdminOfficerProfile {
  const id = "id" in item ? item.id : item.officerId;
  const status = "officerStatus" in item ? item.officerStatus : "ACTIVE";
  const createdAt = "createdAt" in item ? item.createdAt : null;

  return {
    id: String(id),
    userId: String(item.userId),
    officerId: String(id),
    fullName: `User #${item.userId}`,
    gender: "Chưa cập nhật",
    dateOfBirth: "Chưa cập nhật",
    phone: "Chưa cập nhật",
    email: "Chưa cập nhật",
    badgeNumber: item.badgeNumber,
    rank: item.rankName as AdminOfficerProfile["rank"],
    unitId: String(item.unitId),
    unitName: item.unitName,
    joinedAt: createdAt ? formatVietnamDateTime(createdAt) : "Chưa cập nhật",
    status: status === "ACTIVE" ? "ACTIVE" : "SUSPENDED",
    performance: {
      processedCases: 0,
      slaRate: "0%",
      rating: "Chưa có dữ liệu",
    },
    recentCases: [],
  };
}

export const adminOfficerService = {
  async getAll() {
    const response = await apiClient.get<AdminOfficerApiItem[]>(
      endpoints.adminOfficers,
      { auth: true },
    );

    return response.map(toOfficer);
  },

  async getDetail(officerId: string | number) {
    const response = await apiClient.get<AdminOfficerApiItem>(
      endpoints.adminOfficerDetail(officerId),
      { auth: true },
    );

    return toOfficer(response);
  },

  async create(officer: AdminOfficerProfile) {
    const response = await apiClient.post<
      CreateOfficerResponse,
      { userId: number; unitId: number; badgeNumber: string; rankName: string }
    >(
      endpoints.adminOfficers,
      {
        userId: Number(officer.userId),
        unitId: Number(officer.unitId),
        badgeNumber: officer.badgeNumber,
        rankName: officer.rank,
      },
      { auth: true },
    );

    return toOfficer(response);
  },

  async update(officer: AdminOfficerProfile) {
    const response = await apiClient.patch<
      AdminOfficerApiItem,
      {
        unitId: number;
        badgeNumber: string;
        rankName: string;
        officerStatus: "ACTIVE" | "INACTIVE";
      }
    >(
      endpoints.adminOfficerDetail(officer.officerId),
      {
        unitId: Number(officer.unitId),
        badgeNumber: officer.badgeNumber,
        rankName: officer.rank,
        officerStatus: officer.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
      },
      { auth: true },
    );

    return toOfficer(response);
  },
};
