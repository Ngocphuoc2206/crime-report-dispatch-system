import { commanderRiskLevels } from "@/features/commander-dashboard/data/commanderDashboard.data";

const riskColors = {
  urgent: "bg-red-300",
  high: "bg-orange-400",
  medium: "bg-cyan-400",
  low: "bg-slate-600",
};

export function CommanderRiskPanel() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#121b3a] p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Mức bị nguy cấp</h2>
        <span className="text-2xl text-red-300">⚠</span>
      </div>

      <div className="mt-12 flex h-4 overflow-hidden rounded-full bg-slate-700">
        {commanderRiskLevels.map((item) => (
          <div
            key={item.tone}
            className={riskColors[item.tone]}
            style={{ width: `${item.percent}%` }}
          />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {commanderRiskLevels.map((item) => (
          <div key={item.tone} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={["size-3 rounded-full", riskColors[item.tone]].join(
                  " ",
                )}
              />
              <span className="font-semibold text-slate-300">{item.label}</span>
            </div>

            <p className="text-xl font-bold text-slate-200">
              {item.percent}% ({item.count})
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
