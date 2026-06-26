import Link from "next/link";
import { adminRecentUsers } from "@/features/admin-dashboard/data/adminDashboard.data";
import type { AdminRecentUser } from "@/features/admin-dashboard/types/adminDashboard.types";

const roleClassNames: Record<AdminRecentUser["role"], string> = {
  Officer: "bg-slate-100 text-slate-700",
  Dispatcher: "bg-slate-100 text-slate-700",
  Commander: "bg-red-50 text-[var(--primary)]",
  Admin: "bg-red-50 text-[var(--primary)]",
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

export function AdminRecentUsersTable() {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="text-2xl font-black text-slate-950">
          Tài khoản mới tạo
        </h2>

        <Link
          href="/admin/users"
          className="text-sm font-black text-(--primary) hover:underline"
        >
          Xem tất cả →
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Họ tên</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ngày tạo</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {adminRecentUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {user.username}
                </td>

                <td className="px-6 py-4 text-slate-700">{user.fullName}</td>

                <td className="px-6 py-4">
                  <span
                    className={[
                      "rounded-md px-3 py-1 text-xs font-bold",
                      roleClassNames[user.role],
                    ].join(" ")}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={[
                      "rounded-md px-3 py-1 text-xs font-bold",
                      statusClassNames[user.status],
                    ].join(" ")}
                  >
                    ● {statusLabels[user.status]}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-500">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
