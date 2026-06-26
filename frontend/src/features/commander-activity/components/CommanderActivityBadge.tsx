import type {
  CommanderActivityPriority,
  CommanderActivityType,
} from "@/features/commander-activity/types/commanderActivity.types";

const typeConfig: Record<
  CommanderActivityType,
  {
    label: string;
    className: string;
  }
> = {
  EMERGENCY_SIGNAL: {
    label: "Tiếp nhận",
    className: "border-slate-400/40 bg-slate-400/10 text-slate-200",
  },
  CASE_ACCEPTED: {
    label: "Nhận xử lý",
    className: "border-blue-400/50 bg-blue-400/10 text-blue-300",
  },
  STATUS_UPDATED: {
    label: "Cập nhật trạng thái",
    className: "border-orange-400/50 bg-orange-400/10 text-orange-300",
  },
  CASE_COMPLETED: {
    label: "Hoàn tất",
    className: "border-green-400/50 bg-green-400/10 text-green-300",
  },
  SPAM_BLOCKED: {
    label: "Spam",
    className: "border-slate-500/50 bg-slate-500/10 text-slate-400",
  },
};

const priorityConfig: Record<
  CommanderActivityPriority,
  {
    label: string;
    className: string;
  }
> = {
  NONE: {
    label: "Không",
    className: "border-slate-500/50 bg-slate-500/10 text-slate-400",
  },
  LOW: {
    label: "Thấp",
    className: "border-cyan-400/50 bg-cyan-400/10 text-cyan-300",
  },
  MEDIUM: {
    label: "Trung bình",
    className: "border-yellow-400/50 bg-yellow-400/10 text-yellow-300",
  },
  HIGH: {
    label: "Cao",
    className: "border-red-300/50 bg-red-300/10 text-red-200",
  },
  CRITICAL: {
    label: "Khẩn cấp",
    className: "border-red-500/60 bg-red-500/15 text-red-300",
  },
};

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
      Nguy cấp: {config.label}
    </span>
  );
}
