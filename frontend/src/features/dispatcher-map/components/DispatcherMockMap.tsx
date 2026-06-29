"use client";

import type {
  DispatcherMapCase,
  DispatcherMapUnit,
} from "@/features/dispatcher-map/types/dispatcherMap.types";

type DispatcherMockMapProps = {
  cases: DispatcherMapCase[];
  units: DispatcherMapUnit[];
  selectedCaseId: string | null;
  onSelectCase: (item: DispatcherMapCase) => void;
};

const markerColorByPriority: Record<DispatcherMapCase["priority"], string> = {
  CRITICAL: "bg-[var(--primary)] ring-red-500/30",
  HIGH: "bg-orange-500 ring-orange-400/30",
  MEDIUM: "bg-yellow-400 ring-yellow-400/30",
  LOW: "bg-blue-500 ring-blue-400/30",
};

export function DispatcherMockMap({
  cases,
  units,
  selectedCaseId,
  onSelectCase,
}: DispatcherMockMapProps) {
  return (
    <section className="relative min-h-[720px] overflow-hidden rounded-xl border border-red-200 bg-[#1f2a2f] shadow-sm">
      <div className="absolute inset-0 opacity-60">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.24),_transparent_50%)]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.08)_1px,_transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,_transparent_1px)] bg-[size:64px_64px]" />

      <div className="absolute left-5 top-5 z-10 rounded-xl bg-white/95 px-5 py-4 shadow">
        <p className="text-sm font-bold text-slate-500">Bản đồ điều phối</p>
        <p className="mt-1 text-xl font-black text-red-950">
          Khu vực nội thành
        </p>
      </div>

      <div className="absolute right-5 top-5 z-10 rounded-xl bg-white/95 px-5 py-4 shadow">
        <p className="text-sm font-bold text-slate-500">Đang hiển thị</p>
        <p className="mt-1 text-xl font-black text-red-950">
          {cases.length} tin báo
        </p>
      </div>

      {cases.map((item) => {
        const isSelected = selectedCaseId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectCase(item)}
            style={{
              left: `${item.lng}%`,
              top: `${item.lat}%`,
            }}
            className={[
              "absolute z-20 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg ring-[12px] transition hover:scale-110",
              markerColorByPriority[item.priority],
              isSelected ? "scale-125 outline outline-4 outline-white" : "",
            ].join(" ")}
            title={item.caseCode}
          >
            !
          </button>
        );
      })}

      {units.map((unit) => (
        <div
          key={unit.id}
          style={{
            left: `${unit.lng}%`,
            top: `${unit.lat}%`,
          }}
          className="absolute z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-700 text-sm text-white shadow-lg ring-[10px] ring-blue-500/20"
          title={unit.unitCode}
        >
          🚓
        </div>
      ))}

      <div className="absolute bottom-5 left-5 z-10 rounded-xl bg-white/95 p-5 shadow">
        <p className="font-black text-slate-950">Chú giải</p>

        <div className="mt-3 grid gap-2 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[var(--primary)]" />
            Khẩn cấp
          </div>

          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-orange-500" />
            Cao
          </div>

          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-yellow-400" />
            Trung bình
          </div>

          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-blue-500" />
            Thấp
          </div>

          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-blue-700" />
            Đơn vị xử lý
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 right-5 z-10 flex flex-col gap-2">
        <button className="flex size-11 items-center justify-center rounded-lg bg-white font-black shadow">
          +
        </button>

        <button className="flex size-11 items-center justify-center rounded-lg bg-white font-black shadow">
          -
        </button>
      </div>
    </section>
  );
}
