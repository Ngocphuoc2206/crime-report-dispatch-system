import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  AdminUrgencyRule,
  AdminUrgencyRuleApiItem,
  AdminUrgencyRulePayload,
} from "@/features/admin-urgency-rules/types/adminUrgencyRule.types";

export function mapUrgencyRuleFromApi(
  item: AdminUrgencyRuleApiItem,
): AdminUrgencyRule {
  return {
    id: item.id,
    ruleCode: item.ruleCode,
    title: item.ruleCode,
    description: item.description,
    scoreDelta: item.scoreValue,
    status: item.isActive ? "ACTIVE" : "INACTIVE",
  };
}

export function mapUrgencyRuleToPayload(
  rule: AdminUrgencyRule,
): AdminUrgencyRulePayload {
  return {
    id: rule.id,
    ruleCode: rule.ruleCode,
    scoreValue: rule.scoreDelta,
    description: rule.description,
    isActive: rule.status === "ACTIVE",
  };
}

export const adminUrgencyRuleService = {
  getAll: async () => {
    const rules = await apiClient.get<AdminUrgencyRuleApiItem[]>(
      endpoints.adminUrgencyRules,
      { auth: true },
    );

    return rules.map(mapUrgencyRuleFromApi);
  },

  create: async (rule: AdminUrgencyRule) => {
    const created = await apiClient.post<
      AdminUrgencyRuleApiItem,
      AdminUrgencyRulePayload
    >(endpoints.adminUrgencyRules, mapUrgencyRuleToPayload(rule), {
      auth: true,
    });

    return mapUrgencyRuleFromApi(created);
  },

  update: async (rule: AdminUrgencyRule) => {
    const updated = await apiClient.patch<
      AdminUrgencyRuleApiItem,
      AdminUrgencyRulePayload
    >(endpoints.adminUrgencyRuleDetail(rule.id), mapUrgencyRuleToPayload(rule), {
      auth: true,
    });

    return mapUrgencyRuleFromApi(updated);
  },
};
