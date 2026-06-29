import type {
  PendingDispatchPriority,
  PendingDispatchStatus,
} from "@/features/dispatcher-pending/types/dispatcherPending.types";

const priorityConfig: Record<
  PendingDispatchPriority,
  {
    label: string;
    className: string;
  }
> = {
  CRITICAL: {
    label: "Khẩn cấp",
    className: "bg-[var(--primary)] text-white",
  },
  HIGH: {
    label: "Cao",
    className: "bg-orange-500 text-white",
  },
  MEDIUM: {
    label: "Trung bình",
    className: "bg-yellow-400 text-slate-900",
  },
  LOW: {
    label: "Thông thường",
    className: "bg-blue-50 text-blue-700",
  },
};

const statusConfig: Record<
  PendingDispatchStatus,
  {
    label: string;
    className: string;
  }
> = {
  UNASSIGNED: {
    label: "Chưa phân công",
    className: "bg-red-50 text-[var(--primary)] ring-red-200",
  },
  HELD: {
    label: "Tạm giữ",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  TIME_LIMIT: {
    label: "Quá hạn",
    className: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  ASSIGNED: {
    label: "Đã phân công",
    className: "bg-green-50 text-green-700 ring-green-200",
  },
};

export function DispatcherPriorityBadge({
  priority,
}: {
  priority: PendingDispatchPriority;
}) {
  const config = priorityConfig[priority];

  return (
    <span
      className={[
        "inline-flex rounded-md px-3 py-1.5 text-xs font-black uppercase",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}

export function DispatcherCaseStatusBadge({
  status,
}: {
  status: PendingDispatchStatus;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex rounded-md px-3 py-1.5 text-xs font-black ring-1",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
