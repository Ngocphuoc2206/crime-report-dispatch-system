import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  CommanderCase,
  CommanderCaseAttachment,
  CommanderCaseHistory,
  CommanderCaseSeverity,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";

export type CommanderCasePage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

type BackendCaseStatus =
  | "NEW_RECEIVED"
  | "UNDER_VERIFICATION"
  | "TRANSFERRED_TO_INVESTIGATION"
  | "RESOLVED"
  | "SPAM_OR_FAKE";

type CommanderCaseApiItem = {
  id: number;
  trackingCode: string;
  title: string;
  description: string;
  status: BackendCaseStatus;
  urgencyLevel: CommanderCaseSeverity;
  latitude: number | string | null;
  longitude: number | string | null;
  address: string | null;
  assignedUnitId: number | null;
  assignedOfficerId: number | null;
  spamScore?: number | null;
  spamLevel?: "NONE" | "LOW" | "MEDIUM" | "HIGH" | null;
  spamReasons?: string | null;
  createdAt: string;
  updatedAt: string | null;
};

type CommanderCaseHistoryApiItem = {
  id: number;
  action: string;
  oldStatus: BackendCaseStatus | null;
  newStatus: BackendCaseStatus | null;
  note: string | null;
  actorUserId: number;
  createdAt: string;
};

type CommanderCaseDetailApiItem = CommanderCaseApiItem & {
  histories: CommanderCaseHistoryApiItem[];
};

export type CommanderActivityApiItem = {
  id: number;
  caseId: number;
  trackingCode: string;
  action: string;
  description: string;
  actor: string;
  urgencyLevel: CommanderCaseSeverity;
  createdAt: string;
};

type Query = {
  status?: CommanderCaseStatus | "ALL";
  severity?: CommanderCaseSeverity | "ALL";
  keyword?: string;
  page?: number;
  size?: number;
};

const statusToBackend: Partial<Record<CommanderCaseStatus, BackendCaseStatus>> = {
  NEW: "NEW_RECEIVED",
  PROCESSING: "UNDER_VERIFICATION",
  VERIFYING: "UNDER_VERIFICATION",
  INVESTIGATING: "TRANSFERRED_TO_INVESTIGATION",
  RESOLVED: "RESOLVED",
  SPAM_OR_FAKE: "SPAM_OR_FAKE",
};

const statusFromBackend: Record<BackendCaseStatus, CommanderCaseStatus> = {
  NEW_RECEIVED: "NEW",
  UNDER_VERIFICATION: "VERIFYING",
  TRANSFERRED_TO_INVESTIGATION: "INVESTIGATING",
  RESOLVED: "RESOLVED",
  SPAM_OR_FAKE: "SPAM_OR_FAKE",
};

export function toBackendCaseStatus(status: CommanderCaseStatus): BackendCaseStatus {
  return statusToBackend[status] ?? "UNDER_VERIFICATION";
}

function buildQuery(params: Query = {}) {
  const searchParams = new URLSearchParams();

  if (params.status && params.status !== "ALL") {
    searchParams.set("status", toBackendCaseStatus(params.status));
  }

  if (params.severity && params.severity !== "ALL") {
    searchParams.set("urgencyLevel", params.severity);
  }

  if (params.keyword?.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 20));

  return searchParams.toString();
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function toSummary(value: string) {
  return value.length > 160 ? `${value.slice(0, 157)}...` : value;
}

function toHistory(item: CommanderCaseHistoryApiItem): CommanderCaseHistory {
  return {
    id: String(item.id),
    time: formatDateTime(item.createdAt),
    title: item.action,
    description: item.note || `${item.oldStatus ?? ""} -> ${item.newStatus ?? ""}`,
    actor: `User #${item.actorUserId}`,
    tone: item.newStatus === "SPAM_OR_FAKE" ? "danger" : "success",
  };
}

function toCase(item: CommanderCaseApiItem, histories: CommanderCaseHistory[] = []): CommanderCase {
  const latitude = item.latitude == null ? "" : String(item.latitude);
  const longitude = item.longitude == null ? "" : String(item.longitude);
  const attachments: CommanderCaseAttachment[] = [];

  return {
    code: item.trackingCode,
    title: item.title,
    category: item.title,
    shortDescription: toSummary(item.description),
    location: item.address || "Chua cap nhat dia chi",
    severity: item.urgencyLevel,
    status: statusFromBackend[item.status],
    reporter: {
      mode: "anonymous",
      name: "Nguoi bao tin an danh",
    },
    receivedAt: item.createdAt,
    confidence: `${item.urgencyLevel} - auto score`,
    spamScore: item.spamScore,
    spamLevel: item.spamLevel,
    spamReasons: item.spamReasons,
    description: item.description,
    coordinate: latitude && longitude ? `${latitude}, ${longitude}` : "Chua co toa do",
    attachments,
    histories:
      histories.length > 0
        ? histories
        : [
            {
              id: `created-${item.id}`,
              time: formatDateTime(item.createdAt),
              title: "Tiep nhan tin bao",
              description: "He thong ghi nhan tin bao tu cong tiep nhan.",
              actor: "He thong",
              tone: "normal",
            },
          ],
  };
}

export const commanderCaseService = {
  async getCases(params: Query = {}): Promise<CommanderCasePage<CommanderCase>> {
    const response = await apiClient.get<CommanderCasePage<CommanderCaseApiItem>>(
      `${endpoints.commanderCases}?${buildQuery(params)}`,
      { auth: true },
    );

    return {
      ...response,
      content: response.content.map((item) => toCase(item)),
    };
  },

  async getDetail(trackingCode: string): Promise<CommanderCase> {
    const item = await apiClient.get<CommanderCaseDetailApiItem>(
      endpoints.commanderCaseDetail(trackingCode),
      { auth: true },
    );

    return toCase(item, item.histories.map(toHistory));
  },

  async updateStatus(
    trackingCode: string,
    status: CommanderCaseStatus,
    note: string,
  ): Promise<CommanderCase> {
    const item = await apiClient.patch<
      CommanderCaseDetailApiItem,
      { caseStatus: BackendCaseStatus; note: string }
    >(
      endpoints.commanderCaseStatus(trackingCode),
      {
        caseStatus: toBackendCaseStatus(status),
        note,
      },
      { auth: true },
    );

    return toCase(item, item.histories.map(toHistory));
  },

  getActivity: (limit = 20) =>
    apiClient.get<CommanderActivityApiItem[]>(
      `${endpoints.commanderActivity}?limit=${encodeURIComponent(String(limit))}`,
      { auth: true },
    ),
};
