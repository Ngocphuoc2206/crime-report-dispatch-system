import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  DispatchActivity,
  DispatchMetric,
  DispatchPriorityCase,
} from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";
import type { PendingDispatchPriority } from "@/features/dispatcher-pending/types/dispatcherPending.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

type DispatchOverviewApiItem = {
  waitingCases: number;
  assignedTasks: number;
  availableOfficers: number;
  busyOfficers: number;
  criticalCases: number;
  completedTasks: number;
};

type DispatchPriorityApiItem = {
  caseId: number;
  trackingCode: string;
  title: string;
  crimeTypeName: string | null;
  urgencyLevel: PendingDispatchPriority;
  address: string | null;
  createdAt: string;
  spamScore?: number | null;
  spamLevel?: "NONE" | "LOW" | "MEDIUM" | "HIGH" | null;
  spamReasons?: string | null;
};

type DispatchActivityApiItem = {
  id: number;
  caseId: number;
  trackingCode: string | null;
  action: string;
  description: string;
  urgencyLevel: PendingDispatchPriority | null;
  createdAt: string;
};

export const dispatcherDashboardService = {
  async getMetrics(): Promise<DispatchMetric[]> {
    const overview = await apiClient.get<DispatchOverviewApiItem>(
      endpoints.dispatchDashboardOverview,
      { auth: true },
    );

    return [
      {
        id: "waiting",
        label: "Tin cho dieu phoi",
        value: String(overview.waitingCases),
        description: "Nguon tu dispatch-service",
        tone: "default",
      },
      {
        id: "critical",
        label: "Vu viec khan cap",
        value: String(overview.criticalCases),
        description: "Can dieu phoi ngay",
        tone: "danger",
      },
      {
        id: "available",
        label: "Can bo san sang",
        value: `${overview.availableOfficers} / ${
          overview.availableOfficers + overview.busyOfficers
        }`,
        description: "Nguon tu dispatch-service",
        tone: "success",
      },
      {
        id: "assigned",
        label: "Da phan cong",
        value: String(overview.assignedTasks),
        description: "Task dang hoat dong",
        tone: "warning",
      },
      {
        id: "completed",
        label: "Da xu ly",
        value: String(overview.completedTasks),
        description: "Task hoan tat",
        tone: "success",
      },
    ];
  },

  async getPriorityQueue(): Promise<DispatchPriorityCase[]> {
    const response = await apiClient.get<DispatchPriorityApiItem[]>(
      endpoints.dispatchDashboardPriorityQueue,
      { auth: true },
    );

    return response.slice(0, 5).map((item) => ({
      id: String(item.caseId),
      caseCode: item.trackingCode,
      type: item.crimeTypeName || item.title,
      priority: item.urgencyLevel,
      location: item.address || "Chua cap nhat dia chi",
      createdAt: formatVietnamDateTime(item.createdAt),
      waitingTime: "--",
      spamScore: item.spamScore,
      spamLevel: item.spamLevel,
      spamReasons: item.spamReasons,
    }));
  },

  async getActivity(limit = 8): Promise<DispatchActivity[]> {
    const response = await apiClient.get<DispatchActivityApiItem[]>(
      `${endpoints.dispatchDashboardActivity}?limit=${encodeURIComponent(
        String(limit),
      )}`,
      { auth: true },
    );

    return response.map((item) => ({
      id: String(item.id),
      title: `${item.trackingCode || `CASE-${item.caseId}`} - ${item.action}`,
      description: item.description,
      time: formatVietnamDateTime(item.createdAt),
      tone:
        item.urgencyLevel === "CRITICAL"
          ? "danger"
          : item.urgencyLevel === "HIGH"
            ? "warning"
            : "info",
    }));
  },
};
