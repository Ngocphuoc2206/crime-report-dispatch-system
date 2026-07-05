import type {
  AuditActionType,
  KnownAuditActionType,
} from "@/features/officer-audit/types/officerAudit.types";

type OfficerAuditActionBadgeProps = {
  actionType: AuditActionType;
};

const actionConfig: Record<
  KnownAuditActionType,
  {
    label: string;
    className: string;
  }
> = {
  CASE_CREATED: {
    label: "Tạo hồ sơ",
    className: "bg-blue-50 text-blue-700",
  },
  CASE_ASSIGNED: {
    label: "Phân công",
    className: "bg-indigo-50 text-indigo-700",
  },
  CASE_ACCEPTED: {
    label: "Nhận xử lý",
    className: "bg-emerald-50 text-emerald-700",
  },
  CASE_LOCKED: {
    label: "Khóa hồ sơ",
    className: "bg-amber-50 text-amber-700",
  },
  CASE_UNLOCKED: {
    label: "Mở khóa",
    className: "bg-slate-100 text-slate-700",
  },
  CASE_STATUS_CHANGED: {
    label: "Đổi trạng thái",
    className: "bg-green-50 text-green-700",
  },
  REPORTER_IDENTITY_ENCRYPTED: {
    label: "Mã hóa danh tính",
    className: "bg-slate-100 text-slate-700",
  },
  REPORTER_IDENTITY_DECRYPTED: {
    label: "Xem danh tính",
    className: "bg-red-50 text-[var(--primary)]",
  },
  URGENCY_SCORE_CALCULATED: {
    label: "Chấm điểm",
    className: "bg-purple-50 text-purple-700",
  },
  AI_SPAM_ANALYZED: {
    label: "Phân tích AI",
    className: "bg-cyan-50 text-cyan-700",
  },
  CASE_MARKED_SPAM_OR_FAKE: {
    label: "Đánh dấu spam",
    className: "bg-red-50 text-[var(--primary)]",
  },
  CASE_MARKED_NEEDS_REVIEW: {
    label: "Cần rà soát",
    className: "bg-orange-50 text-orange-700",
  },
};

function formatUnknownAction(actionType: AuditActionType) {
  return actionType
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function OfficerAuditActionBadge({
  actionType,
}: OfficerAuditActionBadgeProps) {
  const config = actionConfig[actionType as KnownAuditActionType] ?? {
    label: formatUnknownAction(actionType),
    className: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={[
        "inline-flex rounded-md px-3 py-1 text-xs font-bold uppercase",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
