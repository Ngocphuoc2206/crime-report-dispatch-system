export function DispatcherCaseMap() {
  return (
    <section className="relative min-h-[720px] overflow-hidden rounded-xl border border-red-200 bg-[#20343a] shadow-sm">
      <div className="absolute left-5 top-5 z-10 rounded-lg bg-white/95 px-5 py-3 font-black text-red-950 shadow">
        Khu vực 4 - Cụm kho hàng
      </div>

      <div className="absolute inset-0 opacity-50">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.25),_transparent_48%)]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.08)_1px,_transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,_transparent_1px)] bg-[size:60px_60px]" />

      <div className="absolute left-[56%] top-[51%] flex size-20 items-center justify-center rounded-full bg-[var(--primary)] text-3xl text-white ring-[18px] ring-red-500/20">
        ⚠
      </div>

      <div className="absolute left-[43%] top-[34%] flex size-12 items-center justify-center rounded-full bg-blue-700 text-white ring-8 ring-blue-500/20">
        🚓
      </div>

      <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/95 p-5 shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Đánh giá khu vực</p>
            <p className="mt-1 font-black text-orange-700">Nguy cơ cao</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Đơn vị gần nhất</p>
            <p className="mt-1 font-black text-slate-950">Unit 4A</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Thời gian dự kiến</p>
            <p className="mt-1 font-black text-slate-950">2 phút</p>
          </div>
        </div>
      </div>
    </section>
  );
}
