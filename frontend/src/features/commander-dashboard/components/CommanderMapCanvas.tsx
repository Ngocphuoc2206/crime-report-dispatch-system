"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CommanderMapLegend } from "@/features/commander-dashboard/components/CommanderMapLegend";
import type {
  CommanderMapReport,
  CommanderMapSeverity,
} from "@/features/commander-dashboard/types/commanderMap.types";

type CommanderMapCanvasProps = {
  reports: CommanderMapReport[];
  selectedReport: CommanderMapReport | null;
  onSelectReport: (report: CommanderMapReport) => void;
  isLoading: boolean;
};

type Point = {
  x: number;
  y: number;
};

type MapCenter = {
  latitude: number;
  longitude: number;
};

const tileSize = 256;
const minZoom = 10;
const maxZoom = 16;
const hcmCenter: MapCenter = { latitude: 10.7769, longitude: 106.7009 };

const pinClassNames: Record<CommanderMapSeverity, string> = {
  CRITICAL: "border-white bg-red-500 shadow-red-500/40",
  HIGH: "border-white bg-orange-400 shadow-orange-400/40",
  MEDIUM: "border-white bg-yellow-400 shadow-yellow-400/40",
  LOW: "border-white bg-green-400 shadow-green-400/40",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getWorldSize(zoom: number) {
  return tileSize * 2 ** zoom;
}

function coordinateToWorld(
  latitude: number,
  longitude: number,
  zoom: number,
): Point {
  const worldSize = getWorldSize(zoom);
  const latRad = (clamp(latitude, -85.05112878, 85.05112878) * Math.PI) / 180;
  const sinLat = Math.sin(latRad);

  return {
    x: ((longitude + 180) / 360) * worldSize,
    y:
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
      worldSize,
  };
}

function worldToCoordinate(point: Point, zoom: number): MapCenter {
  const worldSize = getWorldSize(zoom);
  const longitude = (point.x / worldSize) * 360 - 180;
  const mercatorY = 0.5 - point.y / worldSize;
  const latitude =
    (90 - (360 * Math.atan(Math.exp(-mercatorY * 2 * Math.PI))) / Math.PI);

  return { latitude, longitude };
}

function wrapTileX(tileX: number, zoom: number) {
  const tileCount = 2 ** zoom;
  return ((tileX % tileCount) + tileCount) % tileCount;
}

export function CommanderMapCanvas({
  reports,
  selectedReport,
  onSelectReport,
  isLoading,
}: CommanderMapCanvasProps) {
  const mapRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startClient: Point;
    startCenterWorld: Point;
  } | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [center, setCenter] = useState<MapCenter>(hcmCenter);
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

  const tiles = useMemo(() => {
    if (viewport.width === 0 || viewport.height === 0) return [];

    const startX = Math.floor(topLeft.x / tileSize) - 1;
    const endX = Math.floor((topLeft.x + viewport.width) / tileSize) + 1;
    const startY = Math.floor(topLeft.y / tileSize) - 1;
    const endY = Math.floor((topLeft.y + viewport.height) / tileSize) + 1;
    const tileCount = 2 ** zoom;
    const nextTiles: Array<{
      key: string;
      x: number;
      y: number;
      left: number;
      top: number;
    }> = [];

    for (let x = startX; x <= endX; x += 1) {
      for (let y = startY; y <= endY; y += 1) {
        if (y < 0 || y >= tileCount) continue;

        nextTiles.push({
          key: `${zoom}-${x}-${y}`,
          x: wrapTileX(x, zoom),
          y,
          left: x * tileSize - topLeft.x,
          top: y * tileSize - topLeft.y,
        });
      }
    }

    return nextTiles;
  }, [topLeft.x, topLeft.y, viewport.height, viewport.width, zoom]);

  const positionedReports = reports
    .map((report) => {
      const world = coordinateToWorld(report.latitude, report.longitude, zoom);
      return {
        report,
        left: world.x - topLeft.x,
        top: world.y - topLeft.y,
      };
    })
    .filter(
      (item) =>
        item.left >= -40 &&
        item.left <= viewport.width + 40 &&
        item.top >= -40 &&
        item.top <= viewport.height + 40,
    );

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    const startCenterWorld = coordinateToWorld(
      center.latitude,
      center.longitude,
      zoom,
    );

    dragRef.current = {
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startCenterWorld,
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

    setCenter({
      latitude: clamp(nextCenter.latitude, 8, 23),
      longitude: clamp(nextCenter.longitude, 102, 110),
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  function handleZoom(nextZoom: number) {
    setZoom(clamp(nextZoom, minZoom, maxZoom));
  }

  function handleWheel(event: React.WheelEvent<HTMLElement>) {
    event.preventDefault();

    const nextZoom = clamp(zoom + (event.deltaY < 0 ? 1 : -1), minZoom, maxZoom);
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
    const nextCenterWorld = {
      x: nextCursorWorld.x - cursor.x + viewport.width / 2,
      y: nextCursorWorld.y - cursor.y + viewport.height / 2,
    };
    const nextCenter = worldToCoordinate(nextCenterWorld, nextZoom);

    setCenter({
      latitude: clamp(nextCenter.latitude, 8, 23),
      longitude: clamp(nextCenter.longitude, 102, 110),
    });
    setZoom(nextZoom);
  }

  function handleResetView() {
    const target = selectedReport
      ? {
          latitude: selectedReport.latitude,
          longitude: selectedReport.longitude,
        }
      : hcmCenter;

    setCenter(target);
    setZoom(12);
  }

  return (
    <section
      ref={mapRef}
      className="relative min-h-[calc(100vh-5rem)] cursor-grab overflow-hidden bg-slate-100 active:cursor-grabbing"
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

      {positionedReports.map(({ report, left, top }) => (
        <button
          key={report.id}
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setCenter({
              latitude: report.latitude,
              longitude: report.longitude,
            });
            onSelectReport(report);
          }}
          className={[
            "absolute z-10 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 shadow-xl transition hover:scale-125 focus:outline-none focus:ring-4 focus:ring-red-100",
            selectedReport?.id === report.id ? "scale-125 ring-4 ring-red-100" : "",
            pinClassNames[report.severity],
          ].join(" ")}
          style={{ left, top }}
          title={`${report.title} - ${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`}
          aria-label={`Chọn tin báo ${report.code} tại ${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`}
        >
          <span className="absolute inset-[-0.8rem] rounded-full border border-current opacity-40" />
        </button>
      ))}

      {isLoading ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-3xl text-[var(--primary)]">
              +
            </div>

            <h2 className="mt-6 text-xl font-bold uppercase tracking-wide text-[var(--primary)]">
              Đang tải dữ liệu bản đồ
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Đang đồng bộ dữ liệu vị trí từ backend...
            </p>
          </div>
        </div>
      ) : null}

      <div className="absolute bottom-8 left-8 z-20">
        <CommanderMapLegend />
      </div>

      <div
        className="absolute bottom-8 right-8 z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => handleZoom(zoom + 1)}
          className="flex size-11 items-center justify-center border-b border-slate-200 text-xl font-bold text-slate-700 hover:bg-slate-50"
          aria-label="Phong to ban do"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => handleZoom(zoom - 1)}
          className="flex size-11 items-center justify-center border-b border-slate-200 text-xl font-bold text-slate-700 hover:bg-slate-50"
          aria-label="Thu nho ban do"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="flex size-11 items-center justify-center text-xs font-bold text-[var(--primary)] hover:bg-slate-50"
          aria-label="Dua ban do ve trung tam"
        >
          HCM
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
        Map data © OpenStreetMap contributors
      </div>
    </section>
  );
}
