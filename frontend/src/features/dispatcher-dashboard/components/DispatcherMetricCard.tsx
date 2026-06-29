import type { DispatchMetric } from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";

type DispatcherMetricCardProps = {
  metric: DispatchMetric;
};

const toneClassName: Record<DispatchMetric["tone"], string> = {
  default: "border-red-200 bg-red-50 text-red-950",
  danger: "border-red-300 bg-red-100 text-red-900",
  warning: "border-orange-200 bg-orange-50 text-orange-900",
  success: "border-green-200 bg-green-50 text-green-900",
};

export function DispatcherMetricCard({ metric }: DispatcherMetricCardProps) {
  return (
    <article
      className={[
        "rounded-xl border p-5 shadow-sm",
        toneClassName[metric.tone],
      ].join(" ")}
    >
      <p className="text-sm font-bold text-current/70">{metric.label}</p>

      <p className="mt-4 text-4xl font-black">{metric.value}</p>

      <p className="mt-3 text-sm font-semibold text-current/70">
        {metric.description}
      </p>
    </article>
  );
}
