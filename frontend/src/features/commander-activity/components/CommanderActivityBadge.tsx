import type {
  CommanderActivityPriority,
  CommanderActivityType,
} from "@/features/commander-activity/types/commanderActivity.types";

const priorityConfig: Record<
  CommanderActivityPriority,
  {
    label: string;
    className: string;
  }
> = {
  NONE: {
    label: "Không có",
    className: "border-slate-200 bg-slate-50 text-slate-500",
  },
  CRITICAL: {
    label: "Khẩn cấp",
    className: "border-red-200 bg-red-50 text-[var(--primary)]",
  },
  HIGH: {
    label: "Cao",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  MEDIUM: {
    label: "Trung bình",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  LOW: {
    label: "Thấp",
    className: "border-green-200 bg-green-50 text-green-700",
  },
};

const typeConfig: Record<
  CommanderActivityType,
  {
    label: string;
    className: string;
  }
> = {
  EMERGENCY_SIGNAL: {
    label: "Khẩn cấp",
    className: "border-red-200 bg-red-50 text-[var(--primary)]",
  },
  CASE_ACCEPTED: {
    label: "Nhận xử lý",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  STATUS_UPDATED: {
    label: "Cập nhật",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  CASE_COMPLETED: {
    label: "Hoàn tất",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  SPAM_BLOCKED: {
    label: "Spam",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

export function CommanderActivityPriorityBadge({
  priority,
}: {
  priority: CommanderActivityPriority;
}) {
  const config = priorityConfig[priority];

  return (
    <span
      className={[
        "inline-flex rounded border px-3 py-1 text-xs font-bold uppercase",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}

export function CommanderActivityTypeBadge({
  type,
}: {
  type: CommanderActivityType;
}) {
  const config = typeConfig[type];

  return (
    <span
      className={[
        "inline-flex rounded border px-3 py-1 text-xs font-bold uppercase",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
