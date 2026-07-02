import type { CommanderMapReport } from "@/features/commander-dashboard/types/commanderMap.types";

type CommanderMapRealtimePanelProps = {
  hasError: boolean;
  onRetry: () => void;
  resultCount: number;
  selectedReport: CommanderMapReport | null;
  summary: {
    total: number;
    critical: number;
    active: number;
    resolved: number;
  };
};

export function CommanderMapRealtimePanel({
  hasError,
  onRetry,
  resultCount,
  selectedReport,
  summary,
}: CommanderMapRealtimePanelProps) {
  return (
    <aside className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Dữ liệu bản đồ
          </h2>

          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
            {resultCount} kết quả
          </span>
        </div>

        {hasError ? (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-xl bg-white text-3xl font-bold text-[var(--primary)]">
              !
            </div>

            <h3 className="mt-5 text-xl font-bold text-[var(--primary)]">
              Mất kết nối máy chủ dữ liệu
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Không thể truy xuất gói tin báo từ hệ thống trung tâm.
            </p>

            <button
              type="button"
              onClick={onRetry}
              className="mt-6 rounded-md border border-red-200 px-5 py-3 text-sm font-bold text-[var(--primary)] hover:bg-white"
            >
              Thử lại ngay
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase text-slate-500">Tổng</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {summary.total}
              </p>
            </div>

            <div className="rounded-lg border border-red-100 bg-red-50 p-3">
              <p className="text-xs font-bold uppercase text-slate-500">
                Khẩn cấp
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--primary)]">
                {summary.critical}
              </p>
            </div>

            <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
              <p className="text-xs font-bold uppercase text-slate-500">
                Đang xử lý
              </p>
              <p className="mt-2 text-2xl font-bold text-orange-700">
                {summary.active}
              </p>
            </div>

            <div className="rounded-lg border border-green-100 bg-green-50 p-3">
              <p className="text-xs font-bold uppercase text-slate-500">
                Đã xử lý
              </p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {summary.resolved}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Chi tiết tin báo
        </h2>

        {selectedReport ? (
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Mã case
              </p>
              <p className="mt-1 font-mono text-xl font-bold text-slate-950">
                {selectedReport.code}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Loại vụ việc
              </p>
              <p className="mt-1 font-bold text-slate-900">
                {selectedReport.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Mức nguy cấp
                </p>
                <p className="mt-1 font-bold text-[var(--primary)]">
                  {selectedReport.severity}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Trạng thái
                </p>
                <p className="mt-1 font-bold text-slate-800">
                  {selectedReport.status}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Tọa độ từ backend
              </p>
              <p className="mt-2 font-mono text-sm font-bold text-slate-900">
                Lat {selectedReport.latitude.toFixed(6)}
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                Lng {selectedReport.longitude.toFixed(6)}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Thời gian
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {selectedReport.reportedAt}
              </p>
            </div>

            <p className="rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-600">
              Pin trên bản đồ được đặt theo đúng latitude và longitude nhận từ
              API heatmap của backend.
            </p>
          </div>
        ) : (
          <div className="mt-12 text-center text-slate-500">
            <div className="text-5xl">+</div>
            <p className="mt-4 text-sm leading-6">
              Chọn một điểm tin báo trên bản đồ để xem tọa độ và trạng thái chi
              tiết.
            </p>
          </div>
        )}
      </section>
    </aside>
  );
}
