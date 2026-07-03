import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  AcceptCaseResponse,
  OfficerCase,
  OfficerCaseApiItem,
  OfficerCaseDetailApiItem,
  OfficerCaseEvidenceApiItem,
  OfficerCaseEvidenceVerificationStatus,
  OfficerCaseHistoryApiItem,
  OfficerCaseLock,
  OfficerCasePage,
  OfficerCasePriority,
  OfficerCaseStatus,
  OfficerCaseTimelineItem,
  UpdateCaseStatusResponse,
} from "@/features/officer-cases/types/officerCase.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

export type OfficerCaseQuery = {
  status?: OfficerCaseStatus | "ALL";
  urgencyLevel?: OfficerCasePriority | "ALL";
  page?: number;
  size?: number;
};

function buildListQuery(params: OfficerCaseQuery = {}) {
  const searchParams = new URLSearchParams();

  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }

  if (params.urgencyLevel && params.urgencyLevel !== "ALL") {
    searchParams.set("urgencyLevel", params.urgencyLevel);
  }

  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 20));

  return searchParams.toString();
}

function formatFileSize(sizeBytes?: number | null) {
  if (!sizeBytes) return "Không rõ";

  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }

  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatIncidentTime(value: string) {
  return formatVietnamDateTime(value);
}

function toSummary(value: string) {
  return value.length > 180 ? `${value.slice(0, 177)}...` : value;
}

function getStatusText(status?: string | null) {
  const labels: Record<string, string> = {
    NEW_RECEIVED: "Mới tiếp nhận",
    UNDER_VERIFICATION: "Đang xác minh",
    TRANSFERRED_TO_INVESTIGATION: "Đang điều tra",
    RESOLVED: "Đã xử lý",
    SPAM_OR_FAKE: "Hồ sơ giả / Spam",
  };

  return status ? labels[status] ?? status : "";
}

function getActionText(action?: string | null) {
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

function getHistoryTitle(item: OfficerCaseHistoryApiItem) {
  if (
    item.action === "CASE_STATUS_CHANGED" ||
    item.action === "COMMANDER_STATUS_CHANGED"
  ) {
    return item.newStatus
      ? `${getActionText(item.action)}: ${getStatusText(item.newStatus)}`
      : getActionText(item.action);
  }

  return getActionText(item.action);
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

function getHistoryDescription(item: OfficerCaseHistoryApiItem) {
  const normalizedNote = normalizeHistoryNote(item.note);
  if (normalizedNote) return normalizedNote;

  if (item.oldStatus || item.newStatus) {
    if (!item.oldStatus) {
      return `Chuyển sang trạng thái ${getStatusText(item.newStatus)}.`;
    }

    return `Chuyển trạng thái từ ${getStatusText(item.oldStatus)} sang ${getStatusText(
      item.newStatus,
    )}.`;
  }

  return "Hệ thống ghi nhận hoạt động xử lý hồ sơ.";
}

function getHistoryActor(item: OfficerCaseHistoryApiItem) {
  if (item.actorOfficerId) return `Cán bộ #${item.actorOfficerId}`;
  if (item.action === "COMMANDER_STATUS_CHANGED" && item.actorUserId) {
    return `Chỉ huy #${item.actorUserId}`;
  }
  if (item.actorUserId) return `Người dùng #${item.actorUserId}`;
  return "Hệ thống";
}

function toTimeline(
  histories: OfficerCaseHistoryApiItem[] | undefined,
  fallback: OfficerCaseTimelineItem,
) {
  if (!histories?.length) return [fallback];

  return histories
    .slice()
    .sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    )
    .map((item) => ({
      id: `history-${item.id}`,
      title: getHistoryTitle(item),
      description: getHistoryDescription(item),
      actor: getHistoryActor(item),
      occurredAt: item.createdAt,
    }));
}

function toEvidence(item: OfficerCaseEvidenceApiItem) {
  return {
    id: item.id,
    caseId: item.caseId,
    name: item.originalFilename,
    contentType: item.contentType,
    type: item.fileType || item.contentType || "file",
    size: formatFileSize(item.sizeBytes),
    uploadedAt: item.uploadedAt,
    verificationStatus: item.verificationStatus ?? "PENDING",
    verificationNote: item.verificationNote,
    verifiedByUserId: item.verifiedByUserId,
    verifiedAt: item.verifiedAt,
  };
}

function baseCaseFromApi(item: OfficerCaseApiItem): OfficerCase {
  return {
    id: item.id,
    code: item.trackingCode,
    title: item.title,
    summary: toSummary(item.description),
    category: item.title,
    location: item.address || "Chưa cập nhật địa chỉ",
    priority: item.urgencyLevel,
    status: item.status,
    submittedAt: item.createdAt,
    updatedAt: item.updatedAt ?? undefined,
    assignedUnitId: item.assignedUnitId,
    assignedOfficerId: item.assignedOfficerId,
    spamScore: item.spamScore,
    spamLevel: item.spamLevel,
    spamReasons: item.spamReasons,
    assignedOfficerName: item.assignedOfficerId
      ? `Officer #${item.assignedOfficerId}`
      : undefined,
    reporterMode: "anonymous",
    anonymousTemporaryId: `CASE-${item.id}`,
    incident: {
      description: item.description,
      timeText: formatIncidentTime(item.createdAt),
      address: item.address || "Chưa cập nhật địa chỉ",
      latitude: item.latitude == null ? undefined : String(item.latitude),
      longitude: item.longitude == null ? undefined : String(item.longitude),
    },
    evidence: [],
    timeline: [
      {
        id: `created-${item.id}`,
        title: "Tiếp nhận hồ sơ",
        description: "Hệ thống ghi nhận hồ sơ từ cổng tiếp nhận.",
        actor: "Hệ thống",
        occurredAt: item.createdAt,
      },
    ],
  };
}

function detailCaseFromApi(
  item: OfficerCaseDetailApiItem,
  lock?: OfficerCaseLock | null,
): OfficerCase {
  const baseCase = baseCaseFromApi({
    id: item.id,
    trackingCode: item.trackingCode,
    title: item.crimeType,
    description: item.description,
    status: item.status,
    urgencyLevel: item.urgencyLevel,
    latitude: item.latitude,
    longitude: item.longitude,
    address: item.address,
    assignedUnitId: item.assignedUnitId,
    assignedOfficerId: item.assignedOfficerId,
    spamScore: item.spamScore,
    spamLevel: item.spamLevel,
    spamReasons: item.spamReasons,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });

  return {
    ...baseCase,
    category: item.crimeType,
    reporterMode: item.anonymous ? "anonymous" : "identified",
    reporter: item.reporter,
    evidence: item.evidences.map(toEvidence),
    timeline: toTimeline(item.histories, baseCase.timeline[0]),
    lock,
  };
}

export const officerCaseService = {
  async getCases(
    params: OfficerCaseQuery = {},
  ): Promise<OfficerCasePage<OfficerCase>> {
    const query = buildListQuery(params);
    const response = await apiClient.get<OfficerCasePage<OfficerCaseApiItem>>(
      `${endpoints.officerCases}?${query}`,
      { auth: true },
    );

    return {
      ...response,
      content: response.content.map(baseCaseFromApi),
    };
  },

  async getMyCases(
    params: OfficerCaseQuery = {},
  ): Promise<OfficerCasePage<OfficerCase>> {
    const query = buildListQuery(params);
    const response = await apiClient.get<OfficerCasePage<OfficerCaseApiItem>>(
      `${endpoints.officerMyCases}?${query}`,
      { auth: true },
    );

    return {
      ...response,
      content: response.content.map(baseCaseFromApi),
    };
  },

  async getCaseDetail(caseId: string | number): Promise<OfficerCase> {
    const [detail, lock] = await Promise.all([
      apiClient.get<OfficerCaseDetailApiItem>(
        endpoints.officerCaseDetail(caseId),
        { auth: true },
      ),
      apiClient
        .get<OfficerCaseLock>(endpoints.officerCaseLock(caseId), {
          auth: true,
        })
        .catch(() => null),
    ]);

    return detailCaseFromApi(detail, lock);
  },

  acceptCase: (caseId: string | number) =>
    apiClient.post<AcceptCaseResponse>(endpoints.officerCaseAccept(caseId), undefined, {
      auth: true,
    }),

  updateStatus: (
    caseId: string | number,
    caseStatus: OfficerCaseStatus,
    note: string,
  ) =>
    apiClient.patch<
      UpdateCaseStatusResponse,
      { caseStatus: OfficerCaseStatus; note: string }
    >(
      endpoints.officerCaseStatus(caseId),
      {
        caseStatus,
        note,
      },
      { auth: true },
    ),

  acquireLock: (caseId: string | number) =>
    apiClient.post<OfficerCaseLock>(endpoints.officerCaseLock(caseId), undefined, {
      auth: true,
    }),

  renewLock: (caseId: string | number) =>
    apiClient.post<OfficerCaseLock>(endpoints.officerCaseLockRenew(caseId), undefined, {
      auth: true,
    }),

  releaseLock: (caseId: string | number) =>
    apiClient.delete<void>(endpoints.officerCaseLock(caseId), { auth: true }),

  updateEvidenceVerification: (
    evidenceId: string | number,
    status: OfficerCaseEvidenceVerificationStatus,
    note: string | null,
  ) =>
    apiClient.patch<
      OfficerCaseEvidenceApiItem,
      { status: OfficerCaseEvidenceVerificationStatus; note: string | null }
    >(
      endpoints.officerEvidenceVerification(evidenceId),
      { status, note },
      { auth: true },
    ),
};
