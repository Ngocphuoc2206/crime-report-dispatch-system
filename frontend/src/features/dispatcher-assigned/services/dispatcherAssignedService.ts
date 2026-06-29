import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  AssignedCase,
  AssignedCaseStatus,
} from "@/features/dispatcher-assigned/types/dispatcherAssigned.types";

type DispatchTaskStatus =
  | "PENDING"
  | "ASSIGNED"
  | "FAILED"
  | "CANCELLED"
  | "COMPLETED";

type AssignedDispatchTaskApiItem = {
  taskId: number;
  caseId: number;
  trackingCode: string;
  title: string | null;
  urgencyLevel: AssignedCase["priority"];
  address: string | null;
  assignedUnitCode: string | null;
  assignedUnitName: string | null;
  badgeNumber: string | null;
  rankName: string | null;
  dispatchStatus: DispatchTaskStatus;
  createdAt: string;
  updatedAt: string | null;
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusFromBackend(status: DispatchTaskStatus): AssignedCaseStatus {
  if (status === "COMPLETED") return "RESOLVED";
  if (status === "FAILED") return "NEED_SUPPORT";
  if (status === "CANCELLED") return "DISPATCHED";
  return "DISPATCHED";
}

function toAssignedCase(item: AssignedDispatchTaskApiItem): AssignedCase {
  return {
    id: String(item.taskId),
    caseCode: item.trackingCode,
    title: item.title || item.trackingCode,
    priority: item.urgencyLevel,
    location: item.address || "Chua cap nhat dia chi",
    assignedUnit: item.assignedUnitCode || item.assignedUnitName || "Chua co don vi",
    assignedOfficer: item.rankName || item.badgeNumber || "Chua phan cong",
    assignedAt: formatTime(item.updatedAt || item.createdAt),
    eta: "Dang cap nhat",
    slaRemaining: "--",
    status: statusFromBackend(item.dispatchStatus),
  };
}

export const dispatcherAssignedService = {
  async getAssignedCases(): Promise<AssignedCase[]> {
    const response = await apiClient.get<AssignedDispatchTaskApiItem[]>(
      endpoints.dispatchTasks,
      { auth: true },
    );

    return response.map(toAssignedCase);
  },
};
