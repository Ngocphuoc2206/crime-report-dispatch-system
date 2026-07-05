import type { CommanderReportStatus } from "@/features/commander-dashboard/types/commanderDashboard.types";

type CommanderStatusOverviewProps = {
  statuses: CommanderReportStatus[];
};

const toneClassNames = {
  total: "bg-red-50 border-red-100",
  new: "bg-blue-50 border-blue-100",
  verifying: "bg-amber-50 border-amber-100",
  investigating: "bg-orange-50 border-orange-100",
  resolved: "bg-green-50 border-green-100",
  spam: "bg-slate-50 border-slate-200",
};

export function CommanderStatusOverview({
  statuses,
}: CommanderStatusOverviewProps) {
  const topStatuses = statuses.slice(0, 4);
  const bottomStatuses = statuses.slice(4);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-950">Trạng thái xử lý</h2>
        <button className="text-slate-400">...</button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {topStatuses.map((item) => (
          <article
            key={item.id}
            className={["rounded-lg border p-5", toneClassNames[item.tone]].join(
              " ",
            )}
          >
            <p className="text-sm font-bold text-slate-500">{item.label}</p>

            <p className="mt-6 text-4xl font-bold text-slate-950">
              {item.value}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {bottomStatuses.map((item) => (
          <article
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-5 py-4"
          >
            <p className="font-semibold text-slate-500">{item.label}</p>
            <p className="text-2xl font-bold text-slate-800">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
