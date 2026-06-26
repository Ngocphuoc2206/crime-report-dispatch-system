type CommanderMapRealtimePanelProps = {
  hasError: boolean;
  onRetry: () => void;
  resultCount: number;
};

export function CommanderMapRealtimePanel({
  hasError,
  onRetry,
  resultCount,
}: CommanderMapRealtimePanelProps) {
  return (
    <aside className="space-y-4">
      <section className="rounded-xl border border-white/10 bg-[#121b3a] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Luồng dữ liệu thời gian thực
          </h2>

          <span className="rounded bg-white/10 px-2 py-1 text-xs font-bold text-slate-300">
            {resultCount} kết quả
          </span>
        </div>

        {hasError ? (
          <div className="mt-10 rounded-xl border border-red-300/30 bg-red-400/10 p-6 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-xl bg-red-400/10 text-3xl text-red-200">
              ⚠
            </div>

            <h3 className="mt-5 text-xl font-bold text-red-200">
              Mất kết nối máy chủ dữ liệu
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Không thể truy xuất gói tin báo từ hệ thống trung tâm. Kiểm tra
              lại bộ lọc hoặc kết nối mạng nội bộ.
            </p>

            <button
              type="button"
              onClick={onRetry}
              className="mt-6 rounded-md border border-red-300/40 px-5 py-3 text-sm font-bold text-red-200 hover:bg-red-400/10"
            >
              Thử lại ngay
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>Hệ thống đang đồng bộ dữ liệu vị trí.</p>
            <p>Pin đỏ biểu thị tin báo khẩn cấp cần chỉ huy chú ý.</p>
            <p>Click vào điểm tin báo để xem thông tin nhanh.</p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-white/10 bg-[#121b3a] p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
          Chi tiết tín hiệu
        </h2>

        <div className="mt-12 text-center text-slate-500">
          <div className="text-5xl">⌕</div>
          <p className="mt-4 text-sm leading-6">
            Chọn một điểm tin báo trên bản đồ để hiển thị chi tiết tín hiệu.
          </p>
        </div>
      </section>
    </aside>
  );
}
