import type {
  OfficerCasePriority,
  OfficerCaseStatus,
} from "@/features/officer-cases/types/officerCase.types";

export function OfficerCaseStatusBadge({
  status,
}: {
  status: OfficerCaseStatus;
}) {
  const config: Record<
    OfficerCaseStatus,
    { label: string; className: string }
  > = {
    NEW: {
      label: "Mới tiếp nhận",
      className: "bg-sky-50 text-sky-700",
    },
    VERIFYING: {
      label: "Đang xác minh",
      className: "bg-blue-50 text-blue-700",
    },
    NEEDS_ADDITIONAL_EVIDENCE: {
      label: "Cần bổ sung",
      className: "bg-orange-50 text-orange-700",
    },
    RESOLVED: {
      label: "Đã xử lý",
      className: "bg-green-50 text-green-700",
    },
    REJECTED: {
      label: "Hồ sơ giả / Spam",
      className: "bg-red-50 text-[var(--primary)]",
    },
    CLOSED: {
      label: "Đã kết thúc",
      className: "bg-slate-100 text-slate-600",
    },
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${config[status].className}`}
    >
      {config[status].label}
    </span>
  );
}

export function OfficerCasePriorityBadge({
  priority,
}: {
  priority: OfficerCasePriority;
}) {
  const config: Record<
    OfficerCasePriority,
    { label: string; className: string }
  > = {
    LOW: {
      label: "Thấp",
      className: "bg-green-50 text-green-700",
    },
    MEDIUM: {
      label: "Trung bình",
      className: "bg-orange-50 text-orange-700",
    },
    HIGH: {
      label: "Cao",
      className: "bg-red-50 text-[var(--primary)]",
    },
    URGENT: {
      label: "Khẩn cấp",
      className: "bg-red-100 text-[var(--primary)]",
    },
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${config[priority].className}`}
    >
      {config[priority].label}
    </span>
  );
}
