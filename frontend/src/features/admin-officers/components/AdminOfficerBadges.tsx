import type { AdminOfficerStatus } from "@/features/admin-officers/types/adminOfficer.types";

const statusConfig: Record<
  AdminOfficerStatus,
  {
    label: string;
    className: string;
  }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    className: "bg-green-50 text-green-700",
  },
  SUSPENDED: {
    label: "Tạm ngưng",
    className: "bg-yellow-50 text-yellow-700",
  },
};

export function AdminOfficerStatusBadge({
  status,
}: {
  status: AdminOfficerStatus;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-black",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
