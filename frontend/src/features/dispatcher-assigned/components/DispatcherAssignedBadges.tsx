import type {
  AssignedCasePriority,
  AssignedCaseStatus,
} from "@/features/dispatcher-assigned/types/dispatcherAssigned.types";

const priorityConfig: Record<
  AssignedCasePriority,
  { label: string; className: string }
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
    label: "Thấp",
    className: "bg-slate-100 text-slate-700",
  },
};

const statusConfig: Record<
  AssignedCaseStatus,
  { label: string; className: string }
> = {
  DISPATCHED: {
    label: "Đã điều phối",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  ACKNOWLEDGED: {
    label: "Đã tiếp nhận",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  ON_SITE: {
    label: "Đang xử lý hiện trường",
    className: "bg-green-50 text-green-700 ring-green-200",
  },
  NEED_SUPPORT: {
    label: "Cần hỗ trợ",
    className: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  RESOLVED: {
    label: "Đã xử lý",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export function DispatcherAssignedPriorityBadge({
  priority,
}: {
  priority: AssignedCasePriority;
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

export function DispatcherAssignedStatusBadge({
  status,
}: {
  status: AssignedCaseStatus;
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
