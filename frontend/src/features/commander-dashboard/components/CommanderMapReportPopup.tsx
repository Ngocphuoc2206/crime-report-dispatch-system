import Link from "next/link";
import { severityLabels } from "@/features/commander-dashboard/data/commanderMap.data";
import type { CommanderMapReport } from "@/features/commander-dashboard/types/commanderMap.types";

type CommanderMapReportPopupProps = {
  report: CommanderMapReport;
};

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function CommanderMapReportPopup({
  report,
}: CommanderMapReportPopupProps) {
  return (
    <article className="absolute left-[52%] top-[20%] z-20 w-88 rounded-xl border border-red-500/70 bg-[#1d2447] p-5 shadow-2xl shadow-black/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-400">Mã tin báo</p>
          <h2 className="mt-1 font-mono text-2xl font-black text-slate-100">
            #{report.code}
          </h2>
        </div>

        <span className="rounded-md border border-red-400/40 bg-red-400/10 px-3 py-1 text-xs font-bold text-red-200">
          {severityLabels[report.severity]}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">
            Loại tội phạm
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-200">
            {report.category}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-slate-500">
            Thời gian
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-200">
            {formatTime(report.reportedAt)}
          </p>
        </div>

        <div className="col-span-2">
          <p className="text-xs font-bold uppercase text-slate-500">
            Trạng thái
          </p>
          <p className="mt-1 text-sm font-semibold text-cyan-300">
            {report.status}
          </p>
        </div>
      </div>

      <Link
        href={`/commander/cases/${encodeURIComponent(report.code)}`}
        className="mt-5 inline-flex w-full justify-center rounded-md border border-white/15 px-5 py-3 text-sm font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
      >
        Xem chi tiết hồ sơ →
      </Link>
    </article>
  );
}
