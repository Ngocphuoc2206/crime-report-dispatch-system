import type { CommanderCrimeAnalytics as AnalyticsData } from "@/features/commander-dashboard/types/commanderDashboard.types";

type CommanderCrimeAnalyticsProps = {
  analytics: AnalyticsData;
};

const WIDTH = 720;
const HEIGHT = 250;
const PADDING_X = 38;
const PADDING_TOP = 24;
const PADDING_BOTTOM = 48;

function formatChange(value: number | null) {
  if (value === null) return "Chưa đủ dữ liệu so sánh";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function CommanderCrimeAnalytics({
  analytics,
}: CommanderCrimeAnalyticsProps) {
  const points = analytics.monthlyTrend;
  const maxCount = Math.max(...points.map((item) => item.reportCount), 1);
  const chartHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const chartWidth = WIDTH - PADDING_X * 2;
  const coordinates = points.map((item, index) => ({
    ...item,
    x:
      PADDING_X +
      (points.length === 1 ? chartWidth / 2 : (index * chartWidth) / (points.length - 1)),
    y: PADDING_TOP + chartHeight - (item.reportCount / maxCount) * chartHeight,
  }));
  const actualCoordinates = coordinates.filter((item) => !item.forecast);
  const forecastStart = coordinates.slice(-2);
  const directionLabel = {
    UP: "Tăng",
    DOWN: "Giảm",
    STABLE: "Ổn định",
  }[analytics.trendDirection];
  const changeTone =
    analytics.trendDirection === "UP"
      ? "text-red-700 bg-red-50"
      : analytics.trendDirection === "DOWN"
        ? "text-emerald-700 bg-emerald-50"
        : "text-slate-700 bg-slate-100";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-red-700">Crime Analytics &amp; Forecasting</p>
          <h2 className="section-title mt-1">Xu hướng tin báo theo tháng</h2>
          <p className="mt-2 text-sm text-slate-500">
            Số liệu các tháng hoàn chỉnh gần nhất và dự báo cho tháng kế tiếp.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-lg px-4 py-3 ${changeTone}`}>
            <p className="text-xs font-bold uppercase tracking-wide">So với tháng trước</p>
            <p className="mt-1 text-xl font-black">{formatChange(analytics.changePercent)}</p>
            <p className="text-xs font-semibold">{directionLabel}</p>
          </div>
          <div className="rounded-lg bg-violet-50 px-4 py-3 text-violet-800">
            <p className="text-xs font-bold uppercase tracking-wide">Dự báo tháng tới</p>
            <p className="mt-1 text-xl font-black">
              {new Intl.NumberFormat("vi-VN").format(analytics.forecastReportCount)}
            </p>
            <p className="text-xs font-semibold">tin báo</p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="min-w-[620px] w-full"
          role="img"
          aria-label="Biểu đồ xu hướng số lượng tin báo theo tháng"
        >
          {[0, 0.5, 1].map((ratio) => {
            const y = PADDING_TOP + chartHeight * ratio;
            return (
              <g key={ratio}>
                <line
                  x1={PADDING_X}
                  x2={WIDTH - PADDING_X}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 5"
                />
                <text x={4} y={y + 4} fontSize="11" fill="#64748b">
                  {Math.round(maxCount * (1 - ratio))}
                </text>
              </g>
            );
          })}

          <polyline
            points={actualCoordinates.map((item) => `${item.x},${item.y}`).join(" ")}
            fill="none"
            stroke="#c81017"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {forecastStart.length === 2 ? (
            <line
              x1={forecastStart[0].x}
              y1={forecastStart[0].y}
              x2={forecastStart[1].x}
              y2={forecastStart[1].y}
              stroke="#7c3aed"
              strokeWidth="4"
              strokeDasharray="8 7"
              strokeLinecap="round"
            />
          ) : null}

          {coordinates.map((item) => (
            <g key={`${item.year}-${item.month}`}>
              <circle
                cx={item.x}
                cy={item.y}
                r="6"
                fill={item.forecast ? "#7c3aed" : "#c81017"}
                stroke="white"
                strokeWidth="3"
              />
              <text
                x={item.x}
                y={Math.max(item.y - 12, 12)}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill={item.forecast ? "#6d28d9" : "#334155"}
              >
                {item.reportCount}
              </text>
              <text
                x={item.x}
                y={HEIGHT - 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight={item.forecast ? "700" : "500"}
                fill={item.forecast ? "#6d28d9" : "#64748b"}
              >
                {item.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span className="h-1 w-7 rounded bg-red-700" /> Số liệu thực tế
        </span>
        <span className="flex items-center gap-2">
          <span className="w-7 border-t-2 border-dashed border-violet-600" /> Dự báo
        </span>
        <span>
          Phương pháp: hồi quy tuyến tính · Kết quả chỉ mang tính tham khảo.
        </span>
      </div>
    </section>
  );
}
