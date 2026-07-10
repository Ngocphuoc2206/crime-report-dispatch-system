import type { AdminReportMetric } from "@/features/admin-dashboard/types/adminDashboard.types";

type AdminReportStatusGridProps = {
  metrics: AdminReportMetric[];
};

const toneClassNames: Record<AdminReportMetric["tone"], string> = {
  primary: "bg-[var(--primary)] text-white border-[var(--primary)]",
  default: "bg-white text-slate-950 border-slate-200",
  success: "bg-white text-green-600 border-slate-200",
  danger: "bg-white text-[var(--primary)] border-slate-200",
};

export function AdminReportStatusGrid({ metrics }: AdminReportStatusGridProps) {
  return (
    <section>
      <h2 className="section-title">Tình hình tin báo</h2>
      <div className="mt-3 h-px bg-slate-200" />

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className={[
              "min-h-32 rounded-xl border p-6 shadow-sm",
              toneClassNames[metric.tone],
            ].join(" ")}
          >
            <p className="text-sm font-black uppercase tracking-wide opacity-80">
              {metric.label}
            </p>

            <p className="mt-4 text-4xl font-black">{metric.value}</p>

            {metric.description ? (
              <p className="mt-5 text-sm opacity-80">{metric.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
