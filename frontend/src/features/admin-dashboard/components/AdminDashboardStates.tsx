export function AdminDashboardLoadingState() {
  return (
    <section>
      <div className="flex items-center gap-3">
        <span className="text-(--primary)">↻</span>
        <p className="text-xl font-black text-slate-950">
          Đang tải dữ liệu báo cáo...
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="h-6 w-1/2 rounded bg-slate-200" />
            <div className="mt-8 h-8 w-2/3 rounded bg-slate-200" />
            <div className="mt-5 h-5 w-full rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-5">
              <div className="h-6 rounded bg-slate-200" />
              <div className="h-6 rounded bg-slate-200" />
              <div className="h-6 rounded bg-slate-200" />
              <div className="h-6 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminDashboardErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="rounded-xl border border-(--primary) bg-white p-12 text-center shadow-sm">
      <div
        className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-50 text-4xl 
      text-(--primary)"
      >
        ⚠
      </div>

      <h2 className="mt-6 text-2xl font-black text-slate-950">
        Lỗi tải dashboard
      </h2>

      <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
        Đã xảy ra sự cố trong quá trình truy xuất dữ liệu thống kê máy chủ. Vui
        lòng kiểm tra lại kết nối mạng hoặc thử lại sau.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-7 rounded-lg bg-(--primary) px-6 py-3 font-black text-white hover:bg-(--primary-hover)"
      >
        Thử lại
      </button>
    </section>
  );
}
