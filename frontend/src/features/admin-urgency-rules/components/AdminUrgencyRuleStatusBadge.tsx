import type { AdminUrgencyRuleStatus } from "@/features/admin-urgency-rules/types/adminUrgencyRule.types";

const STATUS_CONFIG: Record<
  AdminUrgencyRuleStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Hoạt động",
    className: "bg-blue-50 text-blue-700",
  },
  INACTIVE: {
    label: "Tạm dừng",
    className: "bg-slate-100 text-slate-500",
  },
};

export function AdminUrgencyRuleStatusBadge({
  status,
}: {
  status: AdminUrgencyRuleStatus;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-black",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
