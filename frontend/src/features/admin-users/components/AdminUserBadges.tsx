import type {
  AdminUserRole,
  AdminUserStatus,
} from "@/features/admin-users/types/adminUser.types";

const roleConfig: Record<
  AdminUserRole,
  {
    label: string;
    className: string;
  }
> = {
  ADMIN: {
    label: "ADMIN",
    className: "bg-red-50 text-[var(--primary)]",
  },
  COMMANDER: {
    label: "COMMANDER",
    className: "bg-blue-50 text-blue-700",
  },
  DISPATCHER: {
    label: "DISPATCHER",
    className: "bg-slate-100 text-slate-700",
  },
  OFFICER: {
    label: "OFFICER",
    className: "bg-slate-100 text-slate-700",
  },
};

const statusConfig: Record<
  AdminUserStatus,
  {
    label: string;
    className: string;
  }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    className: "bg-blue-50 text-blue-700",
  },
  LOCKED: {
    label: "Đã khóa",
    className: "bg-red-50 text-[var(--primary)]",
  },
  PENDING: {
    label: "Đang chờ",
    className: "bg-slate-100 text-slate-600",
  },
};

export function AdminRoleBadge({ role }: { role: AdminUserRole }) {
  const config = roleConfig[role];

  return (
    <span
      className={[
        "inline-flex rounded-md px-3 py-1 text-xs font-black",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}

export function AdminStatusBadge({ status }: { status: AdminUserStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex rounded-md px-3 py-1 text-xs font-bold",
        config.className,
      ].join(" ")}
    >
      • {config.label}
    </span>
  );
}
