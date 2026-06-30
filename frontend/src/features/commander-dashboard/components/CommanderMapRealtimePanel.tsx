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
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Luong du lieu thoi gian thuc
          </h2>

          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
            {resultCount} ket qua
          </span>
        </div>

        {hasError ? (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-xl bg-white text-3xl font-black text-[var(--primary)]">
              !
            </div>

            <h3 className="mt-5 text-xl font-bold text-[var(--primary)]">
              Mat ket noi may chu du lieu
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Khong the truy xuat goi tin bao tu he thong trung tam.
            </p>

            <button
              type="button"
              onClick={onRetry}
              className="mt-6 rounded-md border border-red-200 px-5 py-3 text-sm font-bold text-[var(--primary)] hover:bg-white"
            >
              Thu lai ngay
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <p>He thong dang dong bo du lieu vi tri.</p>
            <p>Pin do bieu thi tin bao khan cap can chi huy chu y.</p>
            <p>Click vao diem tin bao de xem thong tin nhanh.</p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Chi tiet tin hieu
        </h2>

        <div className="mt-12 text-center text-slate-500">
          <div className="text-5xl">+</div>
          <p className="mt-4 text-sm leading-6">
            Chon mot diem tin bao tren ban do de hien thi chi tiet tin hieu.
          </p>
        </div>
      </section>
    </aside>
  );
}
