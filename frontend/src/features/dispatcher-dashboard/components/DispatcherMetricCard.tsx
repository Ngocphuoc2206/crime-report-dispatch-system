import type { DispatchMetric } from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";

type DispatcherMetricCardProps = {
  metric: DispatchMetric;
};

const toneClassName: Record<DispatchMetric["tone"], string> = {
  default: "text-slate-950",
  danger: "text-(--primary)",
  warning: "text-orange-700",
  success: "text-green-700",
};

export function DispatcherMetricCard({ metric }: DispatcherMetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <p className="metric-label">
        {metric.label}
      </p>

      <p className={`mt-4 metric-value ${toneClassName[metric.tone]}`}>
        {metric.value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {metric.description}
      </p>
    </article>
  );
}
