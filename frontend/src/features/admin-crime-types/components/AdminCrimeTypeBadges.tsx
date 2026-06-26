import type { AdminCrimeTypeStatus } from "@/features/admin-crime-types/types/adminCrimeType.types";

const statusConfig: Record<
  AdminCrimeTypeStatus,
  {
    label: string;
    className: string;
  }
> = {
  ACTIVE: {
    label: "Hoạt động",
    className: "bg-blue-50 text-blue-700",
  },
  INACTIVE: {
    label: "Ngừng HĐ",
    className: "bg-red-50 text-red-700",
  },
};

export function AdminCrimeTypeStatusBadge({
  status,
}: {
  status: AdminCrimeTypeStatus;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-black",
        config.className,
      ].join(" ")}
    >
      ● {config.label}
    </span>
  );
}
