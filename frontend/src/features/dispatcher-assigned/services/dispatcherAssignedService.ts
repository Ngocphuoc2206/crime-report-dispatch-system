import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import { formatVietnamTime } from "@/utils/dateTime";
import type {
  AssignedCase,
  AssignedCaseStatus,
  ReassignUnitOption,
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

type OfficerAvailabilityApiItem = {
  officerId: number;
  unitId: number;
  unitName: string;
  badgeNumber: string;
  rankName: string | null;
  availabilityStatus: "AVAILABLE" | "BUSY" | "ON_SCENE" | "OFF_DUTY";
};

function statusFromBackend(status: DispatchTaskStatus): AssignedCaseStatus {
  if (status === "COMPLETED") return "RESOLVED";
  if (status === "FAILED") return "NEED_SUPPORT";
  if (status === "CANCELLED") return "CANCELLED";
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
    assignedAt: formatVietnamTime(item.updatedAt || item.createdAt),
    eta: "Dang cap nhat",
    slaRemaining: "--",
    status: statusFromBackend(item.dispatchStatus),
  };
}

function toReassignOption(item: OfficerAvailabilityApiItem): ReassignUnitOption {
  const officerName = item.rankName
    ? `${item.rankName} ${item.badgeNumber}`
    : item.badgeNumber;

  return {
    id: String(item.officerId),
    unitId: item.unitId,
    officerId: item.officerId,
    unitCode: `Unit #${item.unitId}`,
    unitName: item.unitName,
    officerName,
    status: item.availabilityStatus === "AVAILABLE" ? "READY" : "BUSY",
    eta: "Dang cap nhat",
    distance: "Dang cap nhat",
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

  async recallTask(taskId: string): Promise<AssignedCase> {
    const response = await apiClient.patch<AssignedDispatchTaskApiItem>(
      endpoints.dispatchTaskRecall(taskId),
      {},
      { auth: true },
    );

    return toAssignedCase(response);
  },

  async getTask(taskId: string): Promise<AssignedCase> {
    const response = await apiClient.get<AssignedDispatchTaskApiItem>(
      endpoints.dispatchTaskDetail(taskId),
      { auth: true },
    );

    return toAssignedCase(response);
  },

  async getReassignOptions(): Promise<ReassignUnitOption[]> {
    const response = await apiClient.get<OfficerAvailabilityApiItem[]>(
      endpoints.dispatchOfficersAvailable,
      { auth: true },
    );

    return response.map(toReassignOption);
  },

  async reassignTask(
    taskId: string,
    payload: {
      assignedUnitId: number;
      assignedOfficerId: number;
      reason: string;
    },
  ): Promise<AssignedCase> {
    const response = await apiClient.patch<AssignedDispatchTaskApiItem>(
      endpoints.dispatchTaskReassign(taskId),
      payload,
      { auth: true },
    );

    return toAssignedCase(response);
  },
};
