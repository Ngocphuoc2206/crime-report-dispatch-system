"use client";

import { useMemo, useState } from "react";
import { CommanderMapCanvas } from "@/features/commander-dashboard/components/CommanderMapCanvas";
import { CommanderMapFilterPanel } from "@/features/commander-dashboard/components/CommanderMapFilterPanel";
import { CommanderMapRealtimePanel } from "@/features/commander-dashboard/components/CommanderMapRealtimePanel";
import { commanderMapReports } from "@/features/commander-dashboard/data/commanderMap.data";
import type {
  CommanderMapFilter,
  CommanderMapReport,
} from "@/features/commander-dashboard/types/commanderMap.types";

const initialFilter: CommanderMapFilter = {
  region: "ALL",
  severity: "ALL",
  fromDate: "2023-10-24",
  toDate: "2023-10-24",
};

function isInvalidDateRange(filter: CommanderMapFilter) {
  if (!filter.fromDate || !filter.toDate) return false;

  return (
    new Date(filter.fromDate).getTime() > new Date(filter.toDate).getTime()
  );
}

export function CommanderMapContent() {
  const [filter, setFilter] = useState<CommanderMapFilter>(initialFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<CommanderMapFilter>(initialFilter);
  const [selectedReport, setSelectedReport] =
    useState<CommanderMapReport | null>(commanderMapReports[0] ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDataError, setHasDataError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredReports = useMemo(() => {
    return commanderMapReports.filter((report) => {
      const matchedRegion =
        appliedFilter.region === "ALL" ||
        report.district === appliedFilter.region;

      const matchedSeverity =
        appliedFilter.severity === "ALL" ||
        report.severity === appliedFilter.severity;

      const reportDate = new Date(report.reportedAt).getTime();
      const fromDate = new Date(`${appliedFilter.fromDate}T00:00:00`).getTime();
      const toDate = new Date(`${appliedFilter.toDate}T23:59:59`).getTime();

      const matchedDate =
        Number.isNaN(fromDate) ||
        Number.isNaN(toDate) ||
        (reportDate >= fromDate && reportDate <= toDate);

      return matchedRegion && matchedSeverity && matchedDate;
    });
  }, [appliedFilter]);

  function handleApplyFilter() {
    if (isInvalidDateRange(filter)) {
      setFormError(
        `Lỗi: "Từ ngày" không thể lớn hơn "Đến ngày". Vui lòng điều chỉnh lại khoảng thời gian.`,
      );
      setHasDataError(true);
      return;
    }

    setFormError(null);
    setHasDataError(false);
    setIsLoading(true);

    window.setTimeout(() => {
      setAppliedFilter(filter);
      setSelectedReport(null);
      setIsLoading(false);
    }, 900);
  }

  function handleResetFilter() {
    setFilter(initialFilter);
    setAppliedFilter(initialFilter);
    setFormError(null);
    setHasDataError(false);
    setSelectedReport(commanderMapReports[0] ?? null);
  }

  function handleRetry() {
    setHasDataError(false);
    setFormError(null);
    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);
    }, 900);
  }

  return (
    <div className="relative">
      <div className="absolute left-8 top-8 z-30 w-88">
        <CommanderMapFilterPanel
          filter={filter}
          onChange={setFilter}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      </div>

      <div className="absolute right-8 top-8 z-30 rounded-xl border border-white/10 bg-[#121b3a]/95 px-6 py-4 shadow-xl shadow-black/20">
        <p className="text-sm font-medium text-slate-300">
          <span className="mr-3 inline-flex size-2 rounded-full bg-cyan-400" />
          <span className="text-2xl font-black text-slate-100">
            {filteredReports.length}
          </span>{" "}
          kết quả đang hiển thị
        </p>
      </div>

      {formError ? (
        <div className="absolute left-8 right-8 top-76 z-40 rounded-lg border border-red-300/40 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
          {formError}
        </div>
      ) : null}

      <div className="grid min-h-[calc(100vh-5rem)] xl:grid-cols-[1fr_22rem]">
        <CommanderMapCanvas
          reports={hasDataError ? [] : filteredReports}
          selectedReport={selectedReport}
          onSelectReport={setSelectedReport}
          isLoading={isLoading}
        />

        <div className="border-l border-white/10 bg-[#090f24] p-6 pt-28">
          <CommanderMapRealtimePanel
            hasError={hasDataError}
            onRetry={handleRetry}
            resultCount={hasDataError ? 0 : filteredReports.length}
          />
        </div>
      </div>
    </div>
  );
}
