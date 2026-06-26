import type {
  CommanderMapFilter,
  CommanderMapSeverity,
} from "@/features/commander-dashboard/types/commanderMap.types";

type CommanderMapFilterPanelProps = {
  filter: CommanderMapFilter;
  onChange: (filter: CommanderMapFilter) => void;
  onApply: () => void;
  onReset: () => void;
};

const severityOptions: Array<{
  label: string;
  value: "ALL" | CommanderMapSeverity;
}> = [
  { label: "Tất cả", value: "ALL" },
  { label: "Thấp", value: "LOW" },
  { label: "Trung bình", value: "MEDIUM" },
  { label: "Cao", value: "HIGH" },
  { label: "Khẩn cấp", value: "CRITICAL" },
];

export function CommanderMapFilterPanel({
  filter,
  onChange,
  onApply,
  onReset,
}: CommanderMapFilterPanelProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#121b3a]/95 p-6 shadow-xl shadow-black/25">
      <h2 className="text-2xl font-bold text-slate-100">Bộ lọc tin báo</h2>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Khu vực
          </span>

          <select
            value={filter.region}
            onChange={(event) =>
              onChange({
                ...filter,
                region: event.target.value,
              })
            }
            className="mt-2 w-full rounded-md border border-white/10 bg-[#0d1530] px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
          >
            <option value="ALL">Tất cả khu vực</option>
            <option value="quan-1">Quận 1</option>
            <option value="quan-3">Quận 3</option>
            <option value="quan-7">Quận 7</option>
            <option value="binh-thanh">Bình Thạnh</option>
          </select>
        </label>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Mức nguy cấp
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {severityOptions.map((option) => {
              const active = filter.severity === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filter,
                      severity: option.value,
                    })
                  }
                  className={[
                    "rounded-md border px-4 py-2 text-sm font-bold transition",
                    active
                      ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                      : "border-white/10 bg-[#0d1530] text-slate-300 hover:border-cyan-400/60",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Từ ngày
          </span>

          <input
            type="date"
            value={filter.fromDate}
            onChange={(event) =>
              onChange({
                ...filter,
                fromDate: event.target.value,
              })
            }
            className="mt-2 w-full rounded-md border border-white/10 bg-[#0d1530] px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Đến ngày
          </span>

          <input
            type="date"
            value={filter.toDate}
            onChange={(event) =>
              onChange({
                ...filter,
                toDate: event.target.value,
              })
            }
            className="mt-2 w-full rounded-md border border-white/10 bg-[#0d1530] px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-white/15 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            Đặt lại
          </button>

          <button
            type="button"
            onClick={onApply}
            className="rounded-md bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </section>
  );
}
