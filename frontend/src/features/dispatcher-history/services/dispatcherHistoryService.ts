import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { DispatchHistoryItem } from "@/features/dispatcher-history/types/dispatcherHistory.types";

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

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

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
    createdAt: formatDateTime(item.createdAt),
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
