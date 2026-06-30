import type {
  DispatcherMapPriority,
  DispatcherMapStatus,
} from "@/features/dispatcher-map/types/dispatcherMap.types";

const priorityConfig: Record<
  DispatcherMapPriority,
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
    className: "bg-yellow-400 text-slate-950",
  },
  LOW: {
    label: "Thấp",
    className: "bg-blue-50 text-blue-700",
  },
};

const statusConfig: Record<
  DispatcherMapStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Chờ điều phối",
    className: "bg-red-50 text-[var(--primary)] ring-red-200",
  },
  DISPATCHED: {
    label: "Đã điều phối",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  ON_SCENE: {
    label: "Tại hiện trường",
    className: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  RESOLVED: {
    label: "Đã xử lý",
    className: "bg-green-50 text-green-700 ring-green-200",
  },
};

export function DispatcherMapPriorityBadge({
  priority,
}: {
  priority: DispatcherMapPriority;
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

export function DispatcherMapStatusBadge({
  status,
}: {
  status: DispatcherMapStatus;
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
