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
    label: "CRITICAL",
    className: "border-red-500/60 bg-red-500/10 text-red-300",
  },
  HIGH: {
    label: "HIGH",
    className: "border-orange-400/60 bg-orange-400/10 text-orange-300",
  },
  MEDIUM: {
    label: "MEDIUM",
    className: "border-yellow-400/60 bg-yellow-400/10 text-yellow-300",
  },
  LOW: {
    label: "LOW",
    className: "border-cyan-400/60 bg-cyan-400/10 text-cyan-300",
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
    className: "border-cyan-400/60 bg-cyan-400/10 text-cyan-300",
  },
  PROCESSING: {
    label: "Đang xử lý",
    className: "border-yellow-400/60 bg-yellow-400/10 text-yellow-300",
  },
  VERIFYING: {
    label: "Đang xác minh",
    className: "border-blue-400/60 bg-blue-400/10 text-blue-300",
  },
  INVESTIGATING: {
    label: "Điều tra",
    className: "border-red-400/60 bg-red-400/10 text-red-300",
  },
  RESOLVED: {
    label: "Đã giải quyết",
    className: "border-green-400/60 bg-green-400/10 text-green-300",
  },
  SPAM_OR_FAKE: {
    label: "Spam / Fake",
    className: "border-red-300/60 bg-red-300/10 text-red-200",
  },
  CLOSED: {
    label: "Đã kết thúc",
    className: "border-slate-400/40 bg-slate-400/10 text-slate-300",
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
