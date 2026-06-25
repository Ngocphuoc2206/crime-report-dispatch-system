import { OfficerActivityTable } from "@/features/officer-dashboard/components/OfficerActivityTable";
import { OfficerHighPriorityList } from "@/features/officer-dashboard/components/OfficerHighPriorityList";
import { OfficerLineChart } from "@/features/officer-dashboard/components/OfficerLineChart";
import { OfficerMetricCard } from "@/features/officer-dashboard/components/OfficerMetricCard";
import { OfficerUnitStatus } from "@/features/officer-dashboard/components/OfficerUnitStatus";
import {
  activityLogs,
  intakeTrendPoints,
  officerMetrics,
  priorityCases,
  unitStatuses,
} from "@/features/officer-dashboard/data/officerDashboard.data";

export function OfficerDashboardContent() {
  return (
    <div className="px-6 py-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Bảng điều khiển tổng quan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Lúc 10:36 Thứ Ba, 23 tháng 6, 2026
          </p>
        </div>

        <button className="rounded-md border border-red-200 bg-white px-5 py-3 text-sm font-bold text-(--primary) transition hover:bg-red-50">
          Xuất báo cáo
        </button>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {officerMetrics.map((metric) => (
          <OfficerMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <OfficerLineChart data={intakeTrendPoints} />

          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-bold text-slate-900">
              Phân loại mức độ nguy cấp
            </h2>

            <div className="mt-8 grid min-h-48 grid-cols-4 items-end gap-5">
              {[
                { label: "Thấp", height: "35%", color: "bg-green-500" },
                { label: "TB", height: "48%", color: "bg-sky-600" },
                { label: "Cao", height: "64%", color: "bg-orange-500" },
                { label: "Khẩn", height: "82%", color: "bg-[var(--primary)]" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex h-40 w-full items-end rounded bg-slate-50 px-4">
                    <div
                      className={`w-full rounded-t ${item.color}`}
                      style={{ height: item.height }}
                    />
                  </div>

                  <p className="text-sm font-bold text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <OfficerHighPriorityList cases={priorityCases} />
          <OfficerUnitStatus units={unitStatuses} />
        </aside>
      </section>

      <section className="mt-8">
        <OfficerActivityTable logs={activityLogs} />
      </section>
    </div>
  );
}
