import type { CommanderActivity } from "@/features/commander-dashboard/types/commanderDashboard.types";

type CommanderRecentActivityProps = {
  activities: CommanderActivity[];
};

const activityColors = {
  new: "bg-red-50 text-[var(--primary)]",
  verified: "bg-green-50 text-green-700",
  spam: "bg-slate-100 text-slate-500",
  report: "bg-blue-50 text-blue-700",
  broadcast: "bg-amber-50 text-amber-700",
};

export function CommanderRecentActivity({
  activities,
}: CommanderRecentActivityProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="section-title">
        Hoạt động gần đây
      </h2>

      <div className="mt-6 space-y-6">
        {activities.map((item) => (
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
              <p className="font-semibold leading-6 text-slate-700">
                <span className="font-bold text-slate-950">{item.title}</span>{" "}
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
