import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { AdminCrimeType } from "@/features/admin-crime-types/types/adminCrimeType.types";

type AdminCrimeTypeApiItem = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  baseScore: number;
  isActive: boolean;
  category: {
    id: number;
    name: string;
  };
};

function toCrimeType(item: AdminCrimeTypeApiItem): AdminCrimeType {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    description: item.description ?? "",
    categoryId: item.category.id,
    baseScore: item.baseScore,
    status: item.isActive ? "ACTIVE" : "INACTIVE",
  };
}

function toPayload(item: AdminCrimeType) {
  return {
    categoryId: item.categoryId,
    code: item.code,
    name: item.name,
    description: item.description,
    baseScore: item.baseScore,
    isActive: item.status === "ACTIVE",
  };
}

export const adminCrimeTypeService = {
  async getAll() {
    const response = await apiClient.get<AdminCrimeTypeApiItem[]>(
      endpoints.adminCrimeTypes,
      { auth: true },
    );

    return response.map(toCrimeType);
  },

  async create(item: AdminCrimeType) {
    const response = await apiClient.post<AdminCrimeTypeApiItem, ReturnType<typeof toPayload>>(
      endpoints.adminCrimeTypes,
      toPayload(item),
      { auth: true },
    );

    return toCrimeType(response);
  },
};
