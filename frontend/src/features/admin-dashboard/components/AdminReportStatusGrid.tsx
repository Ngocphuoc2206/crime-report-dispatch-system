import type { AdminReportMetric } from "@/features/admin-dashboard/types/adminDashboard.types";

const emptyReportMetrics: AdminReportMetric[] = [
  { id: "total", label: "Tong tin bao", value: "0", tone: "primary" },
  { id: "new", label: "Moi tiep nhan", value: "0", tone: "default" },
  { id: "processing", label: "Dang xu ly", value: "0", tone: "default" },
  { id: "resolved", label: "Da xu ly", value: "0", tone: "success" },
  { id: "urgent", label: "Khan cap", value: "0", tone: "danger" },
  { id: "spam", label: "Gia / Spam", value: "0", tone: "default" },
];

const toneClassNames = {
  primary: "bg-[var(--primary)] text-white border-[var(--primary)]",
  default: "bg-white text-slate-950 border-slate-200",
  success: "bg-white text-green-600 border-slate-200",
  danger: "bg-white text-[var(--primary)] border-slate-200",
};

export function AdminReportStatusGrid() {
  return (
    <section>
      <h2 className="text-2xl font-black text-slate-950">Tình hình tin báo</h2>
      <div className="mt-3 h-px bg-slate-200" />

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {emptyReportMetrics.map((metric) => (
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
