export function AdminDonutChart() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-950">
          Phân bổ trạng thái
        </h2>

        <button className="text-xl text-slate-500">⋮</button>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="relative flex size-56 items-center justify-center rounded-full border-22 border-blue-600">
          <div className="text-center">
            <p className="text-3xl font-black text-slate-950">100%</p>
            <p className="mt-1 text-sm text-slate-500">Tổng</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-blue-600" />
          Mới
        </span>

        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-(--primary)" />
          Khẩn cấp
        </span>

        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-slate-500" />
          Đang xử lý
        </span>

        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-slate-200" />
          Khác
        </span>
      </div>
    </article>
  );
}
