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
    className: "border-red-200 bg-red-50 text-[var(--primary)]",
  },
  HIGH: {
    label: "HIGH",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  MEDIUM: {
    label: "MEDIUM",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  LOW: {
    label: "LOW",
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
    label: "Moi tiep nhan",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  PROCESSING: {
    label: "Dang xu ly",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  VERIFYING: {
    label: "Dang xac minh",
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  INVESTIGATING: {
    label: "Dieu tra",
    className: "border-red-200 bg-red-50 text-[var(--primary)]",
  },
  RESOLVED: {
    label: "Da giai quyet",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  SPAM_OR_FAKE: {
    label: "Spam / Fake",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
  CLOSED: {
    label: "Da ket thuc",
    className: "border-slate-200 bg-slate-50 text-slate-500",
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
