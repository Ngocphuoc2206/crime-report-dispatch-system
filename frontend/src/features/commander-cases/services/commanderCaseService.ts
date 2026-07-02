import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  CommanderCase,
  CommanderCaseAttachment,
  CommanderCaseHistory,
  CommanderCaseSeverity,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

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
  return formatVietnamDateTime(value);
}

function toSummary(value: string) {
  return value.length > 160 ? `${value.slice(0, 157)}...` : value;
}

function getBackendStatusLabel(status?: BackendCaseStatus | null) {
  const labels: Record<BackendCaseStatus, string> = {
    NEW_RECEIVED: "Mới tiếp nhận",
    UNDER_VERIFICATION: "Đang xác minh",
    TRANSFERRED_TO_INVESTIGATION: "Đang điều tra",
    RESOLVED: "Đã giải quyết",
    SPAM_OR_FAKE: "Spam / giả mạo",
  };

  return status ? labels[status] ?? status : "";
}

function getHistoryActionLabel(action?: string | null) {
  const labels: Record<string, string> = {
    CASE_ACCEPTED: "Tiếp nhận xử lý hồ sơ",
    CASE_STATUS_CHANGED: "Cập nhật trạng thái",
    COMMANDER_STATUS_CHANGED: "Chỉ huy cập nhật trạng thái",
    CASE_ASSIGNED: "Phân công hồ sơ",
    CASE_LOCKED: "Khoá hồ sơ xử lý",
    CASE_UNLOCKED: "Mở khoá hồ sơ xử lý",
  };

  return action ? labels[action] ?? action : "Cập nhật hồ sơ";
}

function normalizeHistoryNote(note?: string | null) {
  if (!note) return null;

  const trimmedNote = note.trim();
  const noteLabels: Record<string, string> = {
    "Officer accepted case": "Cán bộ đã nhận xử lý hồ sơ.",
    "Officer accepted case and changed status to UNDER_VERIFICATION":
      "Cán bộ đã nhận xử lý hồ sơ và chuyển sang trạng thái Đang xác minh.",
  };

  return noteLabels[trimmedNote] ?? trimmedNote;
}

function toHistory(item: CommanderCaseHistoryApiItem): CommanderCaseHistory {
  const title =
    item.newStatus &&
    (item.action === "CASE_STATUS_CHANGED" ||
      item.action === "COMMANDER_STATUS_CHANGED")
      ? `${getHistoryActionLabel(item.action)}: ${getBackendStatusLabel(item.newStatus)}`
      : getHistoryActionLabel(item.action);

  const description =
    normalizeHistoryNote(item.note) ||
    (item.oldStatus || item.newStatus
      ? item.oldStatus
        ? `Chuyển trạng thái từ ${getBackendStatusLabel(
            item.oldStatus,
          )} sang ${getBackendStatusLabel(item.newStatus)}.`
        : `Chuyển sang trạng thái ${getBackendStatusLabel(item.newStatus)}.`
      : "Hệ thống ghi nhận hoạt động xử lý hồ sơ.");

  return {
    id: String(item.id),
    time: formatDateTime(item.createdAt),
    title,
    description,
    actor:
      item.action === "COMMANDER_STATUS_CHANGED"
        ? `Chỉ huy #${item.actorUserId}`
        : `Người dùng #${item.actorUserId}`,
    tone: item.newStatus === "SPAM_OR_FAKE" ? "danger" : "success",
  };
}

function toCase(item: CommanderCaseApiItem, histories: CommanderCaseHistory[] = []): CommanderCase {
  const latitude = item.latitude == null ? "" : String(item.latitude);
  const longitude = item.longitude == null ? "" : String(item.longitude);
  const latitudeValue = Number(item.latitude);
  const longitudeValue = Number(item.longitude);
  const hasCoordinates =
    Number.isFinite(latitudeValue) && Number.isFinite(longitudeValue);
  const attachments: CommanderCaseAttachment[] = [];

  return {
    code: item.trackingCode,
    title: item.title,
    category: item.title,
    shortDescription: toSummary(item.description),
    location: item.address || "Chưa cập nhật địa chỉ",
    severity: item.urgencyLevel,
    status: statusFromBackend[item.status],
    reporter: {
      mode: "anonymous",
      name: "Người báo tin ẩn danh",
    },
    receivedAt: item.createdAt,
    confidence: `${item.urgencyLevel} - điểm tự động`,
    spamScore: item.spamScore,
    spamLevel: item.spamLevel,
    spamReasons: item.spamReasons,
    description: item.description,
    coordinate: latitude && longitude ? `${latitude}, ${longitude}` : "Chưa có toạ độ",
    latitude: hasCoordinates ? latitudeValue : null,
    longitude: hasCoordinates ? longitudeValue : null,
    attachments,
    histories:
      histories.length > 0
        ? histories
        : [
            {
              id: `created-${item.id}`,
              time: formatDateTime(item.createdAt),
              title: "Tiếp nhận tin báo",
              description: "Hệ thống ghi nhận tin báo từ cổng tiếp nhận.",
              actor: "Hệ thống",
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

    return toCase(
      item,
      item.histories
        .slice()
        .sort(
          (left, right) =>
            new Date(left.createdAt).getTime() -
            new Date(right.createdAt).getTime(),
        )
        .map(toHistory),
    );
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

    return toCase(
      item,
      item.histories
        .slice()
        .sort(
          (left, right) =>
            new Date(left.createdAt).getTime() -
            new Date(right.createdAt).getTime(),
        )
        .map(toHistory),
    );
  },

  getActivity: (limit = 20) =>
    apiClient.get<CommanderActivityApiItem[]>(
      `${endpoints.commanderActivity}?limit=${encodeURIComponent(String(limit))}`,
      { auth: true },
    ),
};
