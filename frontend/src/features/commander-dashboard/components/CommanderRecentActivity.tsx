import { commanderActivities } from "@/features/commander-dashboard/data/commanderDashboard.data";

const activityColors = {
  new: "bg-cyan-400/20 text-cyan-300",
  verified: "bg-slate-400/20 text-slate-300",
  spam: "bg-slate-400/20 text-slate-300",
  report: "bg-cyan-400/20 text-cyan-300",
  broadcast: "bg-red-400/20 text-red-300",
};

export function CommanderRecentActivity() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#121b3a] p-6 shadow-xl shadow-black/20">
      <h2 className="text-2xl font-bold text-slate-100">Hoạt động gần đây</h2>

      <div className="mt-6 space-y-6">
        {commanderActivities.map((item) => (
          <article key={item.id} className="grid grid-cols-[2.5rem_1fr] gap-4">
            <span
              className={[
                "flex size-10 items-center justify-center rounded-full text-sm font-bold",
                activityColors[item.tone],
              ].join(" ")}
            >
              •
            </span>

            <div>
              <p className="font-semibold leading-6 text-slate-200">
                <span className="font-black">{item.title}</span>{" "}
                {item.description}
              </p>

              <p className="mt-1 text-sm text-slate-500">{item.timeLabel}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
