export type AdminUrgencyRuleStatus = "ACTIVE" | "INACTIVE";

export type AdminUrgencyRule = {
  id: number;
  ruleCode: string;
  title: string;
  description: string;
  scoreDelta: number;
  status: AdminUrgencyRuleStatus;
};

export type UrgencyLevel = "NORMAL" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AdminUrgencyRuleApiItem = {
  id: number;
  ruleCode: string;
  scoreValue: number;
  description: string;
  isActive: boolean;
};

export type AdminUrgencyRulePayload = {
  id?: number;
  ruleCode: string;
  scoreValue: number;
  description: string;
  isActive: boolean;
};
