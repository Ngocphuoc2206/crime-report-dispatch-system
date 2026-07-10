"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { dispatcherMapService } from "@/features/dispatcher-map/services/dispatcherMapService";
import type {
  DispatcherMapCase,
  DispatcherMapUnit,
} from "@/features/dispatcher-map/types/dispatcherMap.types";
import {
  buildVisibleTiles,
  coordinateToWorld,
  hcmCenter,
} from "@/features/dispatcher-map/utils/slippyMap";

const markerColorByPriority: Record<DispatcherMapCase["priority"], string> = {
  CRITICAL: "bg-[var(--primary)] ring-red-500/30",
  HIGH: "bg-orange-500 ring-orange-400/30",
  MEDIUM: "bg-yellow-400 ring-yellow-400/30",
  LOW: "bg-blue-500 ring-blue-400/30",
};

const unitColorByStatus: Record<DispatcherMapUnit["status"], string> = {
  READY: "bg-emerald-500 ring-emerald-500/20",
  BUSY: "bg-blue-600 ring-blue-500/20",
  OFFLINE: "bg-slate-400 ring-slate-400/20",
};

export function DispatcherLiveMapPreview() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [cases, setCases] = useState<DispatcherMapCase[]>([]);
  const [units, setUnits] = useState<DispatcherMapUnit[]>([]);
  const zoom = 11;

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewport({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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

  const center = cases[0]
    ? { latitude: cases[0].lat, longitude: cases[0].lng }
    : hcmCenter;
  const centerWorld = coordinateToWorld(center.latitude, center.longitude, zoom);
  const topLeft = {
    x: centerWorld.x - viewport.width / 2,
    y: centerWorld.y - viewport.height / 2,
  };
  const tiles = buildVisibleTiles({ topLeft, viewport, zoom });
  const criticalCount = cases.filter((item) => item.priority === "CRITICAL").length;
  const positionedCases = cases.map((item) => {
    const world = coordinateToWorld(item.lat, item.lng, zoom);
    return {
      item,
      left: world.x - topLeft.x,
      top: world.y - topLeft.y,
    };
  });
  const positionedUnits = units.map((unit) => {
    const world = coordinateToWorld(unit.lat, unit.lng, zoom);
    return {
      unit,
      left: world.x - topLeft.x,
      top: world.y - topLeft.y,
    };
  });

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="section-title">Bản đồ trực tuyến</h2>

        <Link
          href="/dispatcher/map"
          className="rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-[var(--primary)] hover:bg-red-50"
        >
          Mở rộng
        </Link>
      </header>

      <div ref={mapRef} className="relative h-80 overflow-hidden bg-slate-100">
        <div className="absolute inset-0">
          {tiles.map((tile) => (
            <div
              key={tile.key}
              aria-hidden="true"
              className="absolute size-64 select-none bg-cover bg-center"
              style={{
                left: tile.left,
                top: tile.top,
                backgroundImage: `url(https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png)`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-slate-950/[0.03]" />

        {positionedUnits.map(({ unit, left, top }) => (
          <span
            key={unit.id}
            style={{ left, top }}
            className={[
              "absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4",
              unitColorByStatus[unit.status],
            ].join(" ")}
            title={`${unit.unitCode} - ${unit.lat.toFixed(6)}, ${unit.lng.toFixed(6)}`}
          />
        ))}

        {positionedCases.map(({ item, left, top }) => (
          <span
            key={item.id}
            style={{ left, top }}
            className={[
              "absolute z-20 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-8",
              markerColorByPriority[item.priority],
            ].join(" ")}
            title={`${item.caseCode} - ${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}`}
          />
        ))}

        <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-4 py-3 text-sm font-bold text-slate-800 shadow">
          {cases.length} điểm đang theo dõi
          {criticalCount > 0 ? ` - ${criticalCount} khẩn cấp` : ""}
        </div>

        <div className="absolute bottom-2 right-3 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-500 shadow">
          © OpenStreetMap
        </div>
      </div>
    </section>
  );
}
