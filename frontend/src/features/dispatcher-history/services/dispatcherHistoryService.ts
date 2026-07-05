import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { DispatchHistoryItem } from "@/features/dispatcher-history/types/dispatcherHistory.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

type DispatchHistoryApiItem = {
  id: number;
  dispatchTaskId: number | null;
  caseId: number;
  trackingCode: string | null;
  title: string | null;
  urgencyLevel: string | null;
  action: string;
  previousStatus: string | null;
  nextStatus: string | null;
  assignedUnitName: string | null;
  assignedOfficerBadgeNumber: string | null;
  reason: string | null;
  actor: string | null;
  createdAt: string;
};

function toHistoryItem(item: DispatchHistoryApiItem): DispatchHistoryItem {
  return {
    id: String(item.id),
    taskId: item.dispatchTaskId == null ? null : String(item.dispatchTaskId),
    caseCode: item.trackingCode || `CASE-${item.caseId}`,
    title: item.title || "Ho so dieu phoi",
    urgencyLevel: item.urgencyLevel || "--",
    action: item.action,
    previousStatus: item.previousStatus,
    nextStatus: item.nextStatus,
    assignedUnit: item.assignedUnitName || "--",
    assignedOfficer: item.assignedOfficerBadgeNumber || "--",
    reason: item.reason || "--",
    actor: item.actor || "DISPATCH_SERVICE",
    createdAt: formatVietnamDateTime(item.createdAt),
  };
}

export const dispatcherHistoryService = {
  async getHistory(limit = 100): Promise<DispatchHistoryItem[]> {
    const response = await apiClient.get<DispatchHistoryApiItem[]>(
      `${endpoints.dispatchTaskHistory}?limit=${encodeURIComponent(String(limit))}`,
      { auth: true },
    );

    return response.map(toHistoryItem);
  },
};
