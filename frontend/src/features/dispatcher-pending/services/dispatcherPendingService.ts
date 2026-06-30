import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  PendingDispatchCase,
  PendingDispatchPriority,
  PendingDispatchStatus,
} from "@/features/dispatcher-pending/types/dispatcherPending.types";

type BackendCaseStatus =
  | "NEW_RECEIVED"
  | "UNDER_VERIFICATION"
  | "TRANSFERRED_TO_INVESTIGATION"
  | "RESOLVED"
  | "SPAM_OR_FAKE";

type PendingDispatchApiItem = {
  caseId: number;
  trackingCode: string;
  title: string;
  description: string;
  status: BackendCaseStatus;
  urgencyLevel: PendingDispatchPriority;
  latitude: number | string | null;
  longitude: number | string | null;
  address: string | null;
  crimeTypeName: string | null;
  createdAt: string;
  suggestedUnitName: string | null;
  nearestDistanceKm: number | null;
  spamScore?: number | null;
  spamLevel?: "NONE" | "LOW" | "MEDIUM" | "HIGH" | null;
  spamReasons?: string | null;
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatWaitingTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) return "--";

  const minutes = Math.floor(diffMs / 60_000);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`;
}

function statusFromBackend(status: BackendCaseStatus): PendingDispatchStatus {
  if (status === "NEW_RECEIVED") return "UNASSIGNED";
  if (status === "UNDER_VERIFICATION") return "HELD";
  return "ASSIGNED";
}

function toPendingCase(item: PendingDispatchApiItem): PendingDispatchCase {
  return {
    id: String(item.caseId),
    caseCode: item.trackingCode,
    title: item.title,
    type: item.crimeTypeName || item.title,
    priority: item.urgencyLevel,
    location: item.address || "Chua cap nhat dia chi",
    district: item.address || "Chua cap nhat",
    distanceToUnit:
      item.nearestDistanceKm == null
        ? "Chua tinh"
        : `${item.nearestDistanceKm.toFixed(1)} km`,
    waitTime: formatWaitingTime(item.createdAt),
    createdAt: formatTime(item.createdAt),
    status: statusFromBackend(item.status),
    suggestedUnit: item.suggestedUnitName || "Can goi y tu dispatch-service",
    description: item.description,
    spamScore: item.spamScore,
    spamLevel: item.spamLevel,
    spamReasons: item.spamReasons,
    reporterType: "An danh" as PendingDispatchCase["reporterType"],
    evidenceCount: 0,
  };
}

export const dispatcherPendingService = {
  async getPendingCases(): Promise<PendingDispatchCase[]> {
    const response = await apiClient.get<PendingDispatchApiItem[]>(
      endpoints.dispatchCasesPending,
      { auth: true },
    );

    return response.map(toPendingCase);
  },

  async getDetail(caseCode: string): Promise<PendingDispatchCase | null> {
    const item = await apiClient.get<PendingDispatchApiItem>(
      endpoints.dispatchCaseDetail(caseCode),
      { auth: true },
    );

    return toPendingCase(item);
  },
};
