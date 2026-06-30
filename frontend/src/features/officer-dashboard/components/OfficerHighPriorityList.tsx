import type { PriorityCase } from "@/features/officer-dashboard/types/officerDashboard.types";

type OfficerHighPriorityListProps = {
  cases: PriorityCase[];
};

export function OfficerHighPriorityList({
  cases,
}: OfficerHighPriorityListProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">Ưu tiên cao</h2>

        <span className="rounded bg-(--primary) px-3 py-1 text-xs font-bold text-white shadow-sm shadow-red-950/10">
          {cases.length} mới
        </span>
      </header>

      <div className="divide-y divide-slate-200">
        {cases.map((item) => (
          <article key={item.id} className="p-5 transition hover:bg-red-50/40">
            <div className="flex items-start justify-between gap-4">
              <p className="font-bold text-slate-900">{item.code}</p>
              <span className="text-xs text-slate-500">{item.timeLabel}</span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-700">
              {item.title}: {item.description}
            </p>

            <p
              className={[
                "mt-3 text-xs font-bold uppercase",
                item.level === "urgent"
                  ? "text-(--primary)"
                  : "text-orange-700",
              ].join(" ")}
            >
              {item.level === "urgent" ? "Khẩn cấp" : "Cao"}
            </p>
          </article>
        ))}
      </div>
    </article>
  );
}
