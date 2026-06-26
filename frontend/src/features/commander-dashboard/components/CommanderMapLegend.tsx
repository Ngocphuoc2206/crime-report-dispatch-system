const legendItems = [
  {
    label: "Khẩn cấp (CRITICAL)",
    className: "bg-red-500",
  },
  {
    label: "Cao (HIGH)",
    className: "bg-orange-400",
  },
  {
    label: "Trung bình (MEDIUM)",
    className: "bg-yellow-400",
  },
  {
    label: "Thấp (LOW)",
    className: "bg-green-400",
  },
];

export function CommanderMapLegend() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#121b3a]/90 p-5 shadow-xl shadow-black/20">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
        Chú giải phân loại
      </h2>

      <div className="mt-4 space-y-3">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span
              className={["size-3 rounded-full", item.className].join(" ")}
            />
            <span className="text-sm font-medium text-slate-200">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
