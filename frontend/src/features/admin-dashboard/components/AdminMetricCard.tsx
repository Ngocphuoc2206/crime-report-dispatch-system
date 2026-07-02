import type { AdminAccountMetric } from "@/features/admin-dashboard/types/adminDashboard.types";

type AdminMetricCardProps = {
  metric: AdminAccountMetric;
};

const toneClassNames: Record<
  AdminAccountMetric["tone"],
  {
    label: string;
    value: string;
    icon: string;
  }
> = {
  default: {
    label: "text-slate-500",
    value: "text-slate-950",
    icon: "text-slate-500",
  },
  success: {
    label: "text-blue-600",
    value: "text-slate-950",
    icon: "text-blue-600",
  },
  danger: {
    label: "text-[var(--primary)]",
    value: "text-slate-950",
    icon: "text-[var(--primary)]",
  },
  officer: {
    label: "text-slate-500",
    value: "text-slate-950",
    icon: "text-slate-600",
  },
  dispatcher: {
    label: "text-slate-500",
    value: "text-slate-950",
    icon: "text-slate-600",
  },
  commander: {
    label: "text-slate-500",
    value: "text-slate-950",
    icon: "text-slate-600",
  },
  admin: {
    label: "text-[var(--primary)]",
    value: "text-slate-950",
    icon: "text-[var(--primary)]",
  },
};

export function AdminMetricCard({ metric }: AdminMetricCardProps) {
  const tone = toneClassNames[metric.tone];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={["text-lg", tone.icon].join(" ")}>■</span>
        <p
          className={[
            "text-xs font-black uppercase tracking-wide",
            tone.label,
          ].join(" ")}
        >
          {metric.label}
        </p>
      </div>

      <p className={["mt-5 text-4xl font-black", tone.value].join(" ")}>
        {metric.value}
      </p>
    </article>
  );
}
