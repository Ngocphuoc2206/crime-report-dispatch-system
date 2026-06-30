import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  ApiPage,
  AuditActionFilter,
  AuditLogItem,
  OfficerAuditLogApiItem,
} from "@/features/officer-audit/types/officerAudit.types";

export type OfficerAuditLogQuery = {
  from?: string;
  to?: string;
  action?: AuditActionFilter;
  actorKeyword?: string;
  keyword?: string;
  page?: number;
  size?: number;
};

function buildQuery(params: OfficerAuditLogQuery) {
  const searchParams = new URLSearchParams();

  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.action && params.action !== "ALL") {
    searchParams.set("action", params.action);
  }
  if (params.actorKeyword?.trim()) {
    searchParams.set("actorKeyword", params.actorKeyword.trim());
  }
  if (params.keyword?.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 20));

  return searchParams.toString();
}

function getAccountCode(item: OfficerAuditLogApiItem) {
  if (item.actorUserId) return `U${item.actorUserId}`;
  if (item.actorRole) return item.actorRole.slice(0, 2).toUpperCase();
  return "SYS";
}

function getAccountName(item: OfficerAuditLogApiItem) {
  if (item.actorUserId && item.actorRole) {
    return `USER #${item.actorUserId} - ${item.actorRole}`;
  }

  if (item.actorUserId) return `USER #${item.actorUserId}`;
  if (item.actorRole) return item.actorRole;

  return "Hệ thống";
}

function toAuditLogItem(item: OfficerAuditLogApiItem): AuditLogItem {
  return {
    id: item.id,
    occurredAt: item.occurredAt,
    actorUserId: item.actorUserId,
    actorRole: item.actorRole,
    accountName: getAccountName(item),
    accountCode: getAccountCode(item),
    actionType: item.action,
    resourceType: item.resourceType,
    resourceId: item.resourceId,
    targetCode: item.resourceCode,
    note: item.note || item.detail || item.action,
    ipAddress: item.ipAddress,
    userAgent: item.userAgent,
    detail: item.detail,
    oldValue: item.oldValue,
    newValue: item.newValue,
  };
}

export const officerAuditService = {
  async getAuditLogs(
    params: OfficerAuditLogQuery,
  ): Promise<ApiPage<AuditLogItem>> {
    const query = buildQuery(params);
    const response = await apiClient.get<ApiPage<OfficerAuditLogApiItem>>(
      `${endpoints.officerAuditLogs}?${query}`,
      { auth: true },
    );

    return {
      ...response,
      content: response.content.map(toAuditLogItem),
    };
  },
};
