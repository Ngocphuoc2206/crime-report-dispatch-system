type AdminDonutChartProps = {
  total: number;
  newCount: number;
  urgentCount: number;
  processingCount: number;
};

function percentage(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

export function AdminDonutChart({
  total,
  newCount,
  urgentCount,
  processingCount,
}: AdminDonutChartProps) {
  const newPercent = percentage(newCount, total);
  const urgentPercent = percentage(urgentCount, total);
  const processingPercent = percentage(processingCount, total);
  const otherPercent = Math.max(
    0,
    100 - newPercent - urgentPercent - processingPercent,
  );

  const chartBackground =
    total > 0
      ? `conic-gradient(#2563eb 0 ${newPercent}%, #dc2626 ${newPercent}% ${
          newPercent + urgentPercent
        }%, #64748b ${newPercent + urgentPercent}% ${
          newPercent + urgentPercent + processingPercent
        }%, #e2e8f0 ${newPercent + urgentPercent + processingPercent}% 100%)`
      : "#e2e8f0";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">
        Phân bổ trạng thái
      </h2>

      <div className="mt-10 flex justify-center">
        <div
          className="relative flex size-56 items-center justify-center rounded-full"
          style={{ background: chartBackground }}
        >
          <div className="flex size-40 items-center justify-center rounded-full bg-white text-center">
            <div>
              <p className="text-3xl font-black text-slate-950">{total}</p>
              <p className="mt-1 text-sm text-slate-500">Tổng tin báo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-blue-600" />
          Mới {newPercent}%
        </span>

        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[var(--primary)]" />
          Khẩn cấp {urgentPercent}%
        </span>

        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-slate-500" />
          Đang xử lý {processingPercent}%
        </span>

        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-slate-200" />
          Khác {otherPercent}%
        </span>
      </div>
    </article>
  );
}
