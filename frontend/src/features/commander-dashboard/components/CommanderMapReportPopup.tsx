import type { CommanderMapReport } from "@/features/commander-dashboard/types/commanderMap.types";

type CommanderMapReportPopupProps = {
  report: CommanderMapReport;
};

export function CommanderMapReportPopup({
  report,
}: CommanderMapReportPopupProps) {
  return (
    <article className="absolute left-[52%] top-[20%] z-20 w-88 rounded-xl border border-red-200 bg-white p-5 shadow-2xl shadow-slate-300/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tin báo
          </p>
          <h2 className="mt-1 font-mono text-xl font-bold text-slate-950">
            {report.code}
          </h2>
        </div>

        <span className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-[var(--primary)]">
          {report.severity}
        </span>
      </div>

      <p className="mt-4 font-bold text-slate-800">{report.title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {report.location}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">
            Trạng thái
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--primary)]">
            {report.status}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-slate-500">
            Thời gian
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {report.reportedAt}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex w-full justify-center rounded-md border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        Mở hồ sơ
      </button>
    </article>
  );
}
