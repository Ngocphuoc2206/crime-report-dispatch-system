export type CommanderActivityType =
  | "EMERGENCY_SIGNAL"
  | "CASE_ACCEPTED"
  | "STATUS_UPDATED"
  | "CASE_COMPLETED"
  | "SPAM_BLOCKED";

export type CommanderActivityPriority =
  | "NONE"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type CommanderActivityItem = {
  id: string;
  caseCode: string;
  title: string;
  description: string;
  type: CommanderActivityType;
  priority: CommanderActivityPriority;
  timeLabel: string;
  occurredAt: string;
  actor: string;
};
