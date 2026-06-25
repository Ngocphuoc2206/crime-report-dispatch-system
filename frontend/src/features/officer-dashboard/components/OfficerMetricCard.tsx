import type { OfficerMetric } from "@/features/officer-dashboard/types/officerDashboard.types";

type OfficerMetricCardProps = {
  metric: OfficerMetric;
};

export function OfficerMetricCard({ metric }: OfficerMetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          {metric.label}
        </p>

        <span className="flex size-10 items-center justify-center rounded-md bg-red-50 text-(--primary) ring-1 ring-red-100">
          ■
        </span>
      </div>

      <div className="mt-7 flex items-end gap-3">
        <p className="text-4xl font-bold text-slate-950">{metric.value}</p>

        {metric.trend ? (
          <span
            className={[
              "mb-1 rounded px-2 py-1 text-xs font-bold",
              metric.trendTone === "up"
                ? "bg-green-50 text-green-700"
                : metric.trendTone === "down"
                  ? "bg-red-50 text-(--primary)"
                  : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {metric.trend}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-slate-500">{metric.description}</p>
    </article>
  );
}
