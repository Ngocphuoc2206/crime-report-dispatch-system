import Link from "next/link";
import {
  AdminDataTable,
  AdminTableBody,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableShell,
  AdminTd,
  AdminTh,
} from "@/features/admin-dashboard/components/AdminDataTable";
import type { AdminRecentUser } from "@/features/admin-dashboard/types/adminDashboard.types";

type AdminRecentUsersTableProps = {
  users: AdminRecentUser[];
};

const roleClassNames: Record<AdminRecentUser["role"], string> = {
  OFFICER: "bg-slate-100 text-slate-700",
  DISPATCHER: "bg-slate-100 text-slate-700",
  COMMANDER: "bg-red-50 text-[var(--primary)]",
  ADMIN: "bg-red-50 text-[var(--primary)]",
};

const roleLabels: Record<AdminRecentUser["role"], string> = {
  OFFICER: "Cán bộ",
  DISPATCHER: "Điều phối",
  COMMANDER: "Chỉ huy",
  ADMIN: "Quản trị viên",
};

const statusClassNames: Record<AdminRecentUser["status"], string> = {
  ACTIVE: "bg-blue-50 text-blue-600",
  PENDING: "bg-slate-100 text-slate-600",
  LOCKED: "bg-red-50 text-[var(--primary)]",
};

const statusLabels: Record<AdminRecentUser["status"], string> = {
  ACTIVE: "Hoạt động",
  PENDING: "Đang chờ",
  LOCKED: "Bị khóa",
};

export function AdminRecentUsersTable({ users }: AdminRecentUsersTableProps) {
  return (
    <AdminTableShell>
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="section-title">
          Tài khoản mới tạo
        </h2>

        <Link
          href="/admin/users"
          className="text-sm font-black text-[var(--primary)] hover:underline"
        >
          Xem tất cả -&gt;
        </Link>
      </header>

      <AdminDataTable minWidthClassName="min-w-[800px]">
          <AdminTableHead>
            <tr>
              <AdminTh>Tên đăng nhập</AdminTh>
              <AdminTh>Họ tên</AdminTh>
              <AdminTh>Vai trò</AdminTh>
              <AdminTh>Trạng thái</AdminTh>
              <AdminTh>Ngày tạo</AdminTh>
            </tr>
          </AdminTableHead>

          <AdminTableBody>
            {users.length === 0 ? (
              <AdminTableEmpty colSpan={5}>
                  Hiện chưa có dữ liệu tài khoản mới tạo.
              </AdminTableEmpty>
            ) : null}

            {users.map((user) => (
              <tr key={user.id}>
                <AdminTd className="font-medium text-slate-900">
                  {user.username}
                </AdminTd>

                <AdminTd className="text-slate-700">{user.fullName}</AdminTd>

                <AdminTd>
                  <span
                    className={[
                      "rounded-md px-3 py-1 text-xs font-bold",
                      roleClassNames[user.role],
                    ].join(" ")}
                  >
                    {roleLabels[user.role]}
                  </span>
                </AdminTd>

                <AdminTd>
                  <span
                    className={[
                      "rounded-md px-3 py-1 text-xs font-bold",
                      statusClassNames[user.status],
                    ].join(" ")}
                  >
                    {statusLabels[user.status]}
                  </span>
                </AdminTd>

                <AdminTd className="text-slate-500">{user.createdAt}</AdminTd>
              </tr>
            ))}
          </AdminTableBody>
      </AdminDataTable>
    </AdminTableShell>
  );
}
