import { commanderReportStatuses } from "@/features/commander-dashboard/data/commanderDashboard.data";

const toneClassNames = {
  total: "bg-[#202b55] border-cyan-400/20",
  new: "bg-[#1e2a56] border-cyan-400/20",
  verifying: "bg-[#1e2a56] border-cyan-400/20",
  investigating: "bg-[#1e2a56] border-cyan-400/20",
  resolved: "bg-[#111a36] border-white/10",
  spam: "bg-[#111a36] border-white/10",
};

export function CommanderStatusOverview() {
  const topStatuses = commanderReportStatuses.slice(0, 4);
  const bottomStatuses = commanderReportStatuses.slice(4);

  return (
    <section className="rounded-xl border border-white/10 bg-[#121b3a] p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Trạng thái xử lý</h2>

        <button className="text-slate-400">•••</button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {topStatuses.map((item) => (
          <article
            key={item.id}
            className={[
              "rounded-lg border p-5",
              toneClassNames[item.tone],
            ].join(" ")}
          >
            <p className="text-sm font-bold text-slate-400">{item.label}</p>

            <p className="mt-6 text-5xl font-black tracking-tight text-slate-100">
              {item.value}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {bottomStatuses.map((item) => (
          <article
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0f1733] px-5 py-4"
          >
            <p className="font-semibold text-slate-400">{item.label}</p>
            <p className="text-2xl font-black text-slate-200">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
