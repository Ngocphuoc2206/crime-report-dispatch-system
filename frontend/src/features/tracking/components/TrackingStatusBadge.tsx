import type { TrackingStatus } from "@/features/tracking/types/tracking.types";

type TrackingStatusBadgeProps = {
  status: TrackingStatus;
};

const statusConfig: Record<
  TrackingStatus,
  {
    label: string;
    className: string;
  }
> = {
  NEW_RECEIVED: {
    label: "Đã tiếp nhận",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  UNDER_VERIFICATION: {
    label: "Đang xác minh",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  TRANSFERRED_TO_INVESTIGATION: {
    label: "Đã chuyển xử lý",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  RESOLVED: {
    label: "Đã xử lý",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  SPAM_OR_FAKE: {
    label: "Đã kiểm tra",
    className: "border-red-200 bg-red-50 text-[var(--primary)]",
  },
};

export function TrackingStatusBadge({ status }: TrackingStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-bold",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
