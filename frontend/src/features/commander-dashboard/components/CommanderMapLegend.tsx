const legendItems = [
  { label: "Khan cap (CRITICAL)", className: "bg-red-500" },
  { label: "Cao (HIGH)", className: "bg-orange-400" },
  { label: "Trung binh (MEDIUM)", className: "bg-yellow-400" },
  { label: "Thap (LOW)", className: "bg-green-400" },
];

export function CommanderMapLegend() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Chu giai phan loai
      </h2>

      <div className="mt-4 space-y-3">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span
              className={["size-3 rounded-full", item.className].join(" ")}
            />
            <span className="text-sm font-medium text-slate-700">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
