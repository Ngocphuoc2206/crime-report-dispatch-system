import Link from "next/link";
import { commanderUrgentCases } from "@/features/commander-dashboard/data/commanderDashboard.data";

function getStatusClassName(status: string) {
  if (status.includes("Mới"))
    return "border-red-300/40 bg-red-400/15 text-red-200";
  if (status.includes("Điều"))
    return "border-red-500/40 bg-red-500/15 text-red-200";
  return "border-slate-400/30 bg-slate-400/15 text-slate-200";
}

export function CommanderUrgentTable() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#121b3a] p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <h2 className="text-2xl font-bold text-red-200">
          Tin báo KHẨN CẤP cần chú ý
        </h2>

        <Link
          href="/commander/cases"
          className="text-sm font-bold text-cyan-300"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-3">Mã HS</th>
              <th className="px-3 py-3">Loại vụ việc</th>
              <th className="px-3 py-3">Địa điểm</th>
              <th className="px-3 py-3">Trạng thái</th>
              <th className="px-3 py-3">Thời gian</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {commanderUrgentCases.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-4 font-black text-slate-100">
                  #{item.code}
                </td>

                <td className="px-3 py-4 text-slate-300">{item.category}</td>

                <td className="px-3 py-4 text-slate-300">{item.location}</td>

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

                <td className="px-3 py-4 font-bold text-red-200">
                  {item.timeLabel}
                </td>

                <td className="px-3 py-4">
                  <Link
                    href={`/commander/cases/${item.code}`}
                    className="text-xl text-slate-300 hover:text-cyan-300"
                  >
                    ›
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
