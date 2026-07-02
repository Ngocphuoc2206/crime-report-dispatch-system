"use client";

import { useEffect, useMemo, useState } from "react";
import { CommanderMapCanvas } from "@/features/commander-dashboard/components/CommanderMapCanvas";
import { CommanderMapFilterPanel } from "@/features/commander-dashboard/components/CommanderMapFilterPanel";
import { CommanderMapRealtimePanel } from "@/features/commander-dashboard/components/CommanderMapRealtimePanel";
import { commanderDashboardService } from "@/features/commander-dashboard/services/commanderDashboardService";
import type { CommanderMapHeatmapPoint } from "@/features/commander-dashboard/types/commanderDashboard.types";
import type {
  CommanderMapFilter,
  CommanderMapReport,
} from "@/features/commander-dashboard/types/commanderMap.types";
import { getBackendDateTimeMs } from "@/utils/dateTime";

const today = new Date().toISOString().slice(0, 10);

const initialFilter: CommanderMapFilter = {
  region: "ALL",
  severity: "ALL",
  fromDate: today,
  toDate: today,
};

const hcmBounds = {
  minLat: 10.35,
  maxLat: 11.15,
  minLng: 106.35,
  maxLng: 107.05,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function projectHcmCoordinate(latitude: number, longitude: number) {
  const rawX =
    ((longitude - hcmBounds.minLng) /
      (hcmBounds.maxLng - hcmBounds.minLng)) *
    100;
  const rawY =
    100 -
    ((latitude - hcmBounds.minLat) /
      (hcmBounds.maxLat - hcmBounds.minLat)) *
      100;

  return {
    x: clamp(rawX, 6, 94),
    y: clamp(rawY, 8, 92),
  };
}

function isInvalidDateRange(filter: CommanderMapFilter) {
  if (!filter.fromDate || !filter.toDate) return false;

  return (
    new Date(filter.fromDate).getTime() > new Date(filter.toDate).getTime()
  );
}

function mapHeatmapToReports(
  items: CommanderMapHeatmapPoint[],
): CommanderMapReport[] {
  return items.map((item, index) => {
    const latitude = Number(item.latitude);
    const longitude = Number(item.longitude);
    const projected =
      Number.isFinite(latitude) && Number.isFinite(longitude)
        ? projectHcmCoordinate(latitude, longitude)
        : { x: 15 + index * 8, y: 20 + index * 6 };

    return {
      id: String(item.caseId),
      code: String(item.caseId),
      title: item.crimeTypeName || "Tin báo",
      category: item.crimeTypeName || "Tin báo",
      location:
        Number.isFinite(latitude) && Number.isFinite(longitude)
          ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
          : "Chưa có toạ độ",
      latitude,
      longitude,
      district: "ALL",
      severity: item.urgencyLevel,
      status: item.status,
      reportedAt: item.createdAt,
      x: projected.x,
      y: projected.y,
    };
  });
}

export function CommanderMapContent() {
  const [filter, setFilter] = useState<CommanderMapFilter>(initialFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<CommanderMapFilter>(initialFilter);
  const [reports, setReports] = useState<CommanderMapReport[]>([]);
  const [selectedReport, setSelectedReport] =
    useState<CommanderMapReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDataError, setHasDataError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadHeatmap(nextFilter: CommanderMapFilter) {
    setIsLoading(true);
    setHasDataError(false);

    try {
      const data = await commanderDashboardService.getHeatmap({
        from: `${nextFilter.fromDate}T00:00:00`,
        to: `${nextFilter.toDate}T23:59:59`,
        urgencyLevel:
          nextFilter.severity === "ALL" ? undefined : nextFilter.severity,
      });
      const mappedReports = mapHeatmapToReports(data);

      setReports(mappedReports);
      setSelectedReport(mappedReports[0] ?? null);
    } catch {
      setHasDataError(true);
      setReports([]);
      setSelectedReport(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadHeatmap(initialFilter);
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchedSeverity =
        appliedFilter.severity === "ALL" ||
        report.severity === appliedFilter.severity;

      const reportDate = getBackendDateTimeMs(report.reportedAt);
      const fromDate = new Date(`${appliedFilter.fromDate}T00:00:00`).getTime();
      const toDate = new Date(`${appliedFilter.toDate}T23:59:59`).getTime();

      const matchedDate =
        Number.isNaN(fromDate) ||
        Number.isNaN(toDate) ||
        (reportDate >= fromDate && reportDate <= toDate);

      return matchedSeverity && matchedDate;
    });
  }, [appliedFilter, reports]);

  const mapSummary = useMemo(() => {
    return {
      total: filteredReports.length,
      critical: filteredReports.filter((report) => report.severity === "CRITICAL")
        .length,
      active: filteredReports.filter(
        (report) => report.status !== "RESOLVED" && report.status !== "SPAM_OR_FAKE",
      ).length,
      resolved: filteredReports.filter((report) => report.status === "RESOLVED")
        .length,
    };
  }, [filteredReports]);

  function handleApplyFilter() {
    if (isInvalidDateRange(filter)) {
      setFormError(
        'Lỗi: "Từ ngày" không thể lớn hơn "Đến ngày". Vui lòng điều chỉnh lại khoảng thời gian.',
      );
      setHasDataError(true);
      return;
    }

    setFormError(null);
    setAppliedFilter(filter);
    void loadHeatmap(filter);
  }

  function handleResetFilter() {
    setFilter(initialFilter);
    setAppliedFilter(initialFilter);
    setFormError(null);
    void loadHeatmap(initialFilter);
  }

  function handleRetry() {
    setFormError(null);
    void loadHeatmap(appliedFilter);
  }

  return (
    <div className="relative bg-slate-50">
      <div className="absolute left-8 top-8 z-30 w-80">
        <CommanderMapFilterPanel
          filter={filter}
          onChange={setFilter}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      </div>

      <div className="absolute right-[23rem] top-8 z-30 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <p className="text-sm font-medium text-slate-600">
          <span className="mr-3 inline-flex size-2 rounded-full bg-[var(--primary)]" />
          <span className="text-xl font-bold text-slate-950">
            {filteredReports.length}
          </span>{" "}
          kết quả đang hiển thị
        </p>
      </div>

      {formError ? (
        <div className="absolute left-8 right-8 top-76 z-40 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-[var(--primary)]">
          {formError}
        </div>
      ) : null}

      <div className="grid min-h-[calc(100vh-5rem)] xl:grid-cols-[1fr_22rem]">
        <CommanderMapCanvas
          reports={hasDataError && !reports.length ? [] : filteredReports}
          selectedReport={selectedReport}
          onSelectReport={setSelectedReport}
          isLoading={isLoading}
        />

        <div className="border-l border-slate-200 bg-white p-6 pt-28">
          <CommanderMapRealtimePanel
            hasError={hasDataError}
            onRetry={handleRetry}
            resultCount={filteredReports.length}
            selectedReport={selectedReport}
            summary={mapSummary}
          />
        </div>
      </div>
    </div>
  );
}
