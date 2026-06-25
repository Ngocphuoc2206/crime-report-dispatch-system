import type { IntakeTrendPoint } from "@/features/officer-dashboard/types/officerDashboard.types";

type OfficerLineChartProps = {
  data: IntakeTrendPoint[];
};

function buildPoints(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;

      return `${x},${y}`;
    })
    .join(" ");
}

export function OfficerLineChart({ data }: OfficerLineChartProps) {
  const width = 700;
  const height = 260;

  const receivedPoints = buildPoints(
    data.map((item) => item.received),
    width,
    height,
  );

  const processedPoints = buildPoints(
    data.map((item) => item.processed),
    width,
    height,
  );

  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">
          Xu hướng tiếp nhận trong ngày
        </h2>

        <div className="flex gap-2">
          <span className="rounded bg-red-50 px-3 py-1 text-xs font-bold text-(--primary)">
            Hôm nay
          </span>
          <span className="rounded px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-50">
            7 ngày
          </span>
        </div>
      </header>

      <div className="p-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-72 w-full overflow-visible"
          role="img"
          aria-label="Biểu đồ xu hướng tiếp nhận tin báo"
        >
          <polyline
            points={receivedPoints}
            fill="none"
            stroke="#bf0008"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />

          <polyline
            points={processedPoints}
            fill="none"
            stroke="#092f57"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="mt-4 grid grid-cols-7 text-center text-xs text-slate-500">
          {data.map((item) => (
            <span key={item.time}>{item.time}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
