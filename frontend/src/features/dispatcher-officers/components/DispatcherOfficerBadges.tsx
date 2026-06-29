import type { OfficerAvailabilityStatus } from "@/features/dispatcher-officers/types/dispatcherOfficers.types";

const statusConfig: Record<
  OfficerAvailabilityStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Sẵn sàng",
    className: "bg-green-50 text-green-700 ring-green-200",
  },
  BUSY: {
    label: "Đang bận",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  ON_SCENE: {
    label: "Tại hiện trường",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  OFF_DUTY: {
    label: "Hết ca",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export function DispatcherOfficerStatusBadge({
  status,
}: {
  status: OfficerAvailabilityStatus;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5 text-xs font-black ring-1",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
