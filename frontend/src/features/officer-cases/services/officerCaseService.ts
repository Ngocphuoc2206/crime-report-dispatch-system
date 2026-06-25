import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  AcceptCaseResponse,
  OfficerCase,
  OfficerCaseApiItem,
  OfficerCaseDetailApiItem,
  OfficerCaseEvidenceApiItem,
  OfficerCaseLock,
  OfficerCasePage,
  OfficerCasePriority,
  OfficerCaseStatus,
  UpdateCaseStatusResponse,
} from "@/features/officer-cases/types/officerCase.types";

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
  return value.length > 180 ? `${value.slice(0, 177)}...` : value;
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
  return {
    ...baseCaseFromApi({
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
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }),
    category: item.crimeType,
    reporterMode: item.anonymous ? "anonymous" : "identified",
    evidence: item.evidences.map(toEvidence),
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

  renewLock: (caseId: string | number) =>
    apiClient.post<OfficerCaseLock>(endpoints.officerCaseLockRenew(caseId), undefined, {
      auth: true,
    }),

  releaseLock: (caseId: string | number) =>
    apiClient.delete<void>(endpoints.officerCaseLock(caseId), { auth: true }),
};
