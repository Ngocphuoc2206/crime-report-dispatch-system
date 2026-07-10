import type { UnitStatus } from "@/features/officer-dashboard/types/officerDashboard.types";

type OfficerUnitStatusProps = {
  units: UnitStatus[];
};

const barClassNames: Record<UnitStatus["tone"], string> = {
  navy: "bg-[#092f57]",
  blue: "bg-sky-700",
  green: "bg-green-600",
  red: "bg-[var(--primary)]",
};

export function OfficerUnitStatus({ units }: OfficerUnitStatusProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <header className="border-b border-slate-200 px-6 py-5">
        <h2 className="section-title">Tình trạng đơn vị</h2>
      </header>

      <div className="space-y-5 p-6">
        {units.map((unit) => {
          const percent = Math.round((unit.current / unit.total) * 100);

          return (
            <div key={unit.id}>
              <div className="flex justify-between gap-4 text-sm">
                <p className="font-bold text-slate-900">{unit.unitName}</p>
                <p className="text-slate-600">
                  {unit.current}/{unit.total} đang xử lý
                </p>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full ${barClassNames[unit.tone]}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
