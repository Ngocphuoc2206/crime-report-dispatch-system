import type { ActivityLog } from "@/features/officer-dashboard/types/officerDashboard.types";

type OfficerActivityTableProps = {
  logs: ActivityLog[];
};

const statusClassNames: Record<ActivityLog["status"], string> = {
  received: "bg-slate-100 text-slate-700",
  verifying: "bg-red-50 text-(--primary)",
  resolved: "bg-green-50 text-green-700",
};

const statusLabels: Record<ActivityLog["status"], string> = {
  received: "Đã ghi nhận",
  verifying: "Đang xác minh",
  resolved: "Đã xử lý",
};

export function OfficerActivityTable({ logs }: OfficerActivityTableProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="section-title">Nhật ký hoạt động</h2>

        <button className="text-sm font-bold text-(--primary) hover:text-(--primary-hover)">
          Xem tất cả
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="bg-red-50/50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Mã hồ sơ</th>
              <th className="px-6 py-4">Hành động</th>
              <th className="px-6 py-4">Người thực hiện</th>
              <th className="px-6 py-4">Trạng thái</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {log.time}
                </td>

                <td className="px-6 py-4 font-bold text-slate-900">
                  {log.caseCode}
                </td>

                <td className="px-6 py-4 text-slate-700">{log.action}</td>

                <td className="px-6 py-4 text-slate-700">{log.actor}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded px-3 py-1 text-xs font-bold ${statusClassNames[log.status]}`}
                  >
                    {statusLabels[log.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
