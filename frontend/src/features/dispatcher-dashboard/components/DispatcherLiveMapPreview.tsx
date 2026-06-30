"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dispatcherMapService } from "@/features/dispatcher-map/services/dispatcherMapService";
import type {
  DispatcherMapCase,
  DispatcherMapUnit,
} from "@/features/dispatcher-map/types/dispatcherMap.types";

const markerColorByPriority: Record<DispatcherMapCase["priority"], string> = {
  CRITICAL: "bg-(--primary) ring-red-500/20",
  HIGH: "bg-orange-400 ring-orange-400/20",
  MEDIUM: "bg-yellow-400 ring-yellow-400/20",
  LOW: "bg-blue-400 ring-blue-400/20",
};

export function DispatcherLiveMapPreview() {
  const [cases, setCases] = useState<DispatcherMapCase[]>([]);
  const [units, setUnits] = useState<DispatcherMapUnit[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadMapPreview() {
      try {
        const [caseData, unitData] = await Promise.all([
          dispatcherMapService.getCases(),
          dispatcherMapService.getUnits(),
        ]);

        if (!ignore) {
          setCases(caseData.slice(0, 8));
          setUnits(unitData.slice(0, 8));
        }
      } catch {
        if (!ignore) {
          setCases([]);
          setUnits([]);
        }
      }
    }

    void loadMapPreview();

    return () => {
      ignore = true;
    };
  }, []);

  const criticalCount = cases.filter((item) => item.priority === "CRITICAL").length;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">Bản đồ trực tuyến</h2>

        <Link
          href="/dispatcher/map"
          className="rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-(--primary) hover:bg-red-50"
        >
          Mở rộng
        </Link>
      </header>

      <div className="relative h-80 bg-[#0a2c35]">
        <div className="absolute inset-0 opacity-50">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_45%)]" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {cases.map((item) => (
          <span
            key={item.id}
            style={{
              left: `${item.lng}%`,
              top: `${item.lat}%`,
            }}
            className={[
              "absolute z-20 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-8",
              markerColorByPriority[item.priority],
            ].join(" ")}
            title={item.caseCode}
          />
        ))}

        {units.map((unit) => (
          <span
            key={unit.id}
            style={{
              left: `${unit.lng}%`,
              top: `${unit.lat}%`,
            }}
            className="absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400 ring-4 ring-green-400/20"
            title={unit.unitCode}
          />
        ))}

        <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-3 text-sm font-bold text-slate-800">
          {cases.length} diem nong dang theo doi
          {criticalCount > 0 ? ` - ${criticalCount} khan cap` : ""}
        </div>
      </div>
    </section>
  );
}
