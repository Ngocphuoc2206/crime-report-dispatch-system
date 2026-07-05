import Link from "next/link";
import type { CommanderUrgentCase } from "@/features/commander-dashboard/types/commanderDashboard.types";

type CommanderUrgentTableProps = {
  cases: CommanderUrgentCase[];
};

function getStatusClassName(status: string) {
  if (status.includes("Mới") || status.includes("Moi") || status.includes("NEW")) {
    return "border-red-200 bg-red-50 text-[var(--primary)]";
  }

  if (status.includes("Điều") || status.includes("Dieu") || status.includes("TRANSFERRED")) {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function CommanderUrgentTable({ cases }: CommanderUrgentTableProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <h2 className="text-xl font-bold text-[var(--primary)]">
          Tin báo khẩn cấp cần chú ý
        </h2>

        <Link
          href="/commander/cases"
          className="text-sm font-bold text-[var(--primary)]"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Mã HS</th>
              <th className="px-3 py-3">Loại vụ việc</th>
              <th className="px-3 py-3">Địa điểm</th>
              <th className="px-3 py-3">Trạng thái</th>
              <th className="px-3 py-3">Thời gian</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {cases.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-3 py-4 font-bold text-slate-950">
                  #{item.code}
                </td>

                <td className="px-3 py-4 text-slate-700">{item.category}</td>
                <td className="px-3 py-4 text-slate-700">{item.location}</td>

                <td className="px-3 py-4">
                  <span
                    className={[
                      "rounded border px-3 py-2 text-xs font-bold",
                      getStatusClassName(item.status),
                    ].join(" ")}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-3 py-4 font-bold text-[var(--primary)]">
                  {item.timeLabel}
                </td>

                <td className="px-3 py-4">
                  <Link
                    href={`/commander/cases/${item.code}`}
                    className="text-xl text-slate-500 hover:text-[var(--primary)]"
                  >
                    &gt;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
