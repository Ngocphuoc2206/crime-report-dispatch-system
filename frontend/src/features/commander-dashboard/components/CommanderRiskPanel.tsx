import type { CommanderRiskLevel } from "@/features/commander-dashboard/types/commanderDashboard.types";

type CommanderRiskPanelProps = {
  levels: CommanderRiskLevel[];
};

const riskColors = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-green-500",
};

export function CommanderRiskPanel({ levels }: CommanderRiskPanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-950">Muc do nguy cap</h2>
        <span className="text-2xl font-black text-[var(--primary)]">!</span>
      </div>

      <div className="mt-12 flex h-4 overflow-hidden rounded-full bg-slate-100">
        {levels.map((item) => (
          <div
            key={item.tone}
            className={riskColors[item.tone]}
            style={{ width: `${item.percent}%` }}
          />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {levels.map((item) => (
          <div key={item.tone} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={["size-3 rounded-full", riskColors[item.tone]].join(
                  " ",
                )}
              />
              <span className="font-semibold text-slate-600">{item.label}</span>
            </div>

            <p className="text-xl font-bold text-slate-800">
              {item.percent}% ({item.count})
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
