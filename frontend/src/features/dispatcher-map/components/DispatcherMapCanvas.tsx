"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  DispatcherMapCase,
  DispatcherMapUnit,
} from "@/features/dispatcher-map/types/dispatcherMap.types";
import {
  buildVisibleTiles,
  clamp,
  coordinateToWorld,
  hcmCenter,
  maxDispatcherZoom,
  minDispatcherZoom,
  type MapCoordinate,
  type MapPoint,
  worldToCoordinate,
} from "@/features/dispatcher-map/utils/slippyMap";

type DispatcherMapCanvasProps = {
  cases: DispatcherMapCase[];
  units: DispatcherMapUnit[];
  selectedCaseId: string | null;
  onSelectCase: (item: DispatcherMapCase) => void;
};

const markerColorByPriority: Record<DispatcherMapCase["priority"], string> = {
  CRITICAL: "border-white bg-[var(--primary)] shadow-red-500/40",
  HIGH: "border-white bg-orange-500 shadow-orange-400/40",
  MEDIUM: "border-white bg-yellow-400 shadow-yellow-400/40",
  LOW: "border-white bg-blue-500 shadow-blue-400/40",
};

const unitColorByStatus: Record<DispatcherMapUnit["status"], string> = {
  READY: "border-white bg-emerald-500 shadow-emerald-500/30",
  BUSY: "border-white bg-blue-600 shadow-blue-500/30",
  OFFLINE: "border-white bg-slate-400 shadow-slate-400/30",
};

export function DispatcherMapCanvas({
  cases,
  units,
  selectedCaseId,
  onSelectCase,
}: DispatcherMapCanvasProps) {
  const mapRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startClient: MapPoint;
    startCenterWorld: MapPoint;
  } | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [center, setCenter] = useState<MapCoordinate>(hcmCenter);
  const [zoom, setZoom] = useState(12);

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

  const centerWorld = useMemo(
    () => coordinateToWorld(center.latitude, center.longitude, zoom),
    [center.latitude, center.longitude, zoom],
  );
  const topLeft = {
    x: centerWorld.x - viewport.width / 2,
    y: centerWorld.y - viewport.height / 2,
  };
  const tiles = buildVisibleTiles({ topLeft, viewport, zoom });
  const selectedCase = cases.find((item) => item.id === selectedCaseId) ?? null;

  const positionedCases = cases
    .map((item) => {
      const world = coordinateToWorld(item.lat, item.lng, zoom);
      return {
        item,
        left: world.x - topLeft.x,
        top: world.y - topLeft.y,
      };
    })
    .filter(
      (item) =>
        item.left >= -48 &&
        item.left <= viewport.width + 48 &&
        item.top >= -48 &&
        item.top <= viewport.height + 48,
    );

  const positionedUnits = units
    .map((unit) => {
      const world = coordinateToWorld(unit.lat, unit.lng, zoom);
      return {
        unit,
        left: world.x - topLeft.x,
        top: world.y - topLeft.y,
      };
    })
    .filter(
      (item) =>
        item.left >= -48 &&
        item.left <= viewport.width + 48 &&
        item.top >= -48 &&
        item.top <= viewport.height + 48,
    );

  function clampMapCenter(nextCenter: MapCoordinate) {
    return {
      latitude: clamp(nextCenter.latitude, 8, 23),
      longitude: clamp(nextCenter.longitude, 102, 110),
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    dragRef.current = {
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startCenterWorld: coordinateToWorld(center.latitude, center.longitude, zoom),
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startClient.x;
    const dy = event.clientY - drag.startClient.y;
    const nextCenter = worldToCoordinate(
      {
        x: drag.startCenterWorld.x - dx,
        y: drag.startCenterWorld.y - dy,
      },
      zoom,
    );

    setCenter(clampMapCenter(nextCenter));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  function handleZoom(nextZoom: number) {
    setZoom(clamp(nextZoom, minDispatcherZoom, maxDispatcherZoom));
  }

  function handleWheel(event: React.WheelEvent<HTMLElement>) {
    event.preventDefault();

    const nextZoom = clamp(
      zoom + (event.deltaY < 0 ? 1 : -1),
      minDispatcherZoom,
      maxDispatcherZoom,
    );
    if (nextZoom === zoom || viewport.width === 0 || viewport.height === 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const cursor = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const cursorWorld = {
      x: topLeft.x + cursor.x,
      y: topLeft.y + cursor.y,
    };
    const cursorCoordinate = worldToCoordinate(cursorWorld, zoom);
    const nextCursorWorld = coordinateToWorld(
      cursorCoordinate.latitude,
      cursorCoordinate.longitude,
      nextZoom,
    );
    const nextCenter = worldToCoordinate(
      {
        x: nextCursorWorld.x - cursor.x + viewport.width / 2,
        y: nextCursorWorld.y - cursor.y + viewport.height / 2,
      },
      nextZoom,
    );

    setCenter(clampMapCenter(nextCenter));
    setZoom(nextZoom);
  }

  function handleResetView() {
    setCenter(
      selectedCase
        ? { latitude: selectedCase.lat, longitude: selectedCase.lng }
        : hcmCenter,
    );
    setZoom(12);
  }

  return (
    <section
      ref={mapRef}
      className="relative min-h-[720px] cursor-grab overflow-hidden rounded-xl border border-red-200 bg-slate-100 shadow-sm active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
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

      <div className="absolute left-5 top-5 z-20 rounded-xl bg-white/95 px-5 py-4 shadow">
        <p className="text-sm font-bold text-slate-500">Bản đồ điều phối</p>
        <p className="mt-1 text-xl font-bold text-red-950">
          {cases.length} tin báo - {units.length} đơn vị
        </p>
      </div>

      {positionedUnits.map(({ unit, left, top }) => (
        <div
          key={unit.id}
          style={{ left, top }}
          className={[
            "absolute z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 text-xs font-bold text-white shadow-lg transition hover:scale-110",
            unitColorByStatus[unit.status],
          ].join(" ")}
          title={`${unit.unitCode} - ${unit.lat.toFixed(6)}, ${unit.lng.toFixed(6)}`}
        >
          CA
        </div>
      ))}

      {positionedCases.map(({ item, left, top }) => {
        const isSelected = selectedCaseId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => {
              setCenter({ latitude: item.lat, longitude: item.lng });
              onSelectCase(item);
            }}
            style={{ left, top }}
            className={[
              "absolute z-20 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 text-white shadow-xl transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-100",
              markerColorByPriority[item.priority],
              isSelected ? "scale-125 ring-4 ring-red-100" : "",
            ].join(" ")}
            title={`${item.caseCode} - ${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}`}
            aria-label={`Chọn tin báo ${item.caseCode}`}
          >
            !
          </button>
        );
      })}

      <div className="absolute bottom-5 left-5 z-20 rounded-xl bg-white/95 p-5 shadow">
        <p className="font-bold text-slate-950">Chú giải</p>

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
            <span className="size-3 rounded-full bg-emerald-500" />
            Đơn vị sẵn sàng
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-blue-600" />
            Đơn vị bận
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-5 right-5 z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => handleZoom(zoom + 1)}
          className="flex size-11 items-center justify-center border-b border-slate-200 text-xl font-bold text-slate-700 hover:bg-slate-50"
          aria-label="Phóng to bản đồ"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => handleZoom(zoom - 1)}
          className="flex size-11 items-center justify-center border-b border-slate-200 text-xl font-bold text-slate-700 hover:bg-slate-50"
          aria-label="Thu nhỏ bản đồ"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="flex size-11 items-center justify-center text-xs font-bold text-[var(--primary)] hover:bg-slate-50"
          aria-label="Đưa bản đồ về trung tâm"
        >
          HCM
        </button>
      </div>

      <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
        Map data © OpenStreetMap contributors
      </div>
    </section>
  );
}
