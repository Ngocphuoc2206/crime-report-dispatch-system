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
  { label: "Tat ca", value: "ALL" },
  { label: "Thap", value: "LOW" },
  { label: "Trung binh", value: "MEDIUM" },
  { label: "Cao", value: "HIGH" },
  { label: "Khan cap", value: "CRITICAL" },
];

export function CommanderMapFilterPanel({
  filter,
  onChange,
  onApply,
  onReset,
}: CommanderMapFilterPanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
      <h2 className="text-2xl font-bold text-slate-950">Bo loc tin bao</h2>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Khu vuc
          </span>

          <select
            value={filter.region}
            onChange={(event) =>
              onChange({
                ...filter,
                region: event.target.value,
              })
            }
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          >
            <option value="ALL">Tat ca khu vuc</option>
            <option value="quan-1">Quan 1</option>
            <option value="quan-3">Quan 3</option>
            <option value="quan-7">Quan 7</option>
            <option value="binh-thanh">Binh Thanh</option>
          </select>
        </label>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Muc nguy cap
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
                      ? "border-[var(--primary)] bg-red-50 text-[var(--primary)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[var(--primary)]",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tu ngay
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
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Den ngay
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
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Dat lai
          </button>

          <button
            type="button"
            onClick={onApply}
            className="rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
          >
            Ap dung
          </button>
        </div>
      </div>
    </section>
  );
}
