import type {
  CommanderCaseSeverity,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";

const severityConfig: Record<
  CommanderCaseSeverity,
  {
    label: string;
    className: string;
  }
> = {
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

const statusConfig: Record<
  CommanderCaseStatus,
  {
    label: string;
    className: string;
  }
> = {
  NEW: {
    label: "Mới tiếp nhận",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  PROCESSING: {
    label: "Đang xử lý",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  VERIFYING: {
    label: "Đang xác minh",
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  INVESTIGATING: {
    label: "Đang điều tra",
    className: "border-red-200 bg-red-50 text-[var(--primary)]",
  },
  RESOLVED: {
    label: "Đã giải quyết",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  SPAM_OR_FAKE: {
    label: "Spam / giả mạo",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

export function CommanderSeverityBadge({
  severity,
}: {
  severity: CommanderCaseSeverity;
}) {
  const config = severityConfig[severity];

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

export function CommanderStatusBadge({
  status,
}: {
  status: CommanderCaseStatus;
}) {
  const config = statusConfig[status];

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
