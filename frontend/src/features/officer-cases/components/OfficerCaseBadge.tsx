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
    NEW_RECEIVED: {
      label: "Mới tiếp nhận",
      className: "bg-sky-50 text-sky-700",
    },
    UNDER_VERIFICATION: {
      label: "Đang xác minh",
      className: "bg-blue-50 text-blue-700",
    },
    TRANSFERRED_TO_INVESTIGATION: {
      label: "Chuyển điều tra",
      className: "bg-indigo-50 text-indigo-700",
    },
    RESOLVED: {
      label: "Đã xử lý",
      className: "bg-green-50 text-green-700",
    },
    SPAM_OR_FAKE: {
      label: "Hồ sơ giả / Spam",
      className: "bg-red-50 text-[var(--primary)]",
    },
  };

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${config[status].className}`}
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
    CRITICAL: {
      label: "Khẩn cấp",
      className: "bg-red-100 text-[var(--primary)]",
    },
  };

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold uppercase ${config[priority].className}`}
    >
      {config[priority].label}
    </span>
  );
}
