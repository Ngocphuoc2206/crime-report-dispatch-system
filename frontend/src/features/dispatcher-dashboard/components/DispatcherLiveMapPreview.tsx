export function DispatcherLiveMapPreview() {
  return (
    <section className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-red-100 px-5 py-4">
        <h2 className="text-xl font-black text-red-950">Bản đồ trực tuyến</h2>

        <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-slate-600">
          Mở rộng
        </button>
      </header>

      <div className="relative h-80 bg-[#0a2c35]">
        <div className="absolute inset-0 opacity-50">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_45%)]" />
        </div>

        <div className="absolute left-[48%] top-[45%] size-5 rounded-full bg-(--primary) ring-8 ring-red-500/20" />
        <div className="absolute left-[70%] top-[36%] size-3 rounded-full bg-orange-400 ring-4 ring-orange-400/20" />
        <div className="absolute left-[35%] top-[62%] size-3 rounded-full bg-yellow-400 ring-4 ring-yellow-400/20" />
        <div className="absolute left-[58%] top-[70%] size-3 rounded-full bg-green-400 ring-4 ring-green-400/20" />

        <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-3 text-sm font-bold text-slate-800">
          5 điểm nóng đang theo dõi
        </div>
      </div>
    </section>
  );
}
