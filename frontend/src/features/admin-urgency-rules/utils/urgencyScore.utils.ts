import type { UrgencyLevel } from "@/features/admin-urgency-rules/types/adminUrgencyRule.types";

export function resolveUrgencyLevel(score: number): UrgencyLevel {
  if (score >= 100) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "NORMAL";
}

export function getUrgencyLevelLabel(level: UrgencyLevel) {
  switch (level) {
    case "CRITICAL":
      return "Khẩn cấp";
    case "HIGH":
      return "Cao";
    case "MEDIUM":
      return "Trung bình";
    default:
      return "Bình thường";
  }
}

export function getUrgencyLevelClass(level: UrgencyLevel) {
  switch (level) {
    case "CRITICAL":
      return "bg-red-50 text-red-700";
    case "HIGH":
      return "bg-orange-50 text-orange-700";
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
