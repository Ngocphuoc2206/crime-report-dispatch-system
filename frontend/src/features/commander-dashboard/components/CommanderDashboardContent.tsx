"use client";

import { useEffect, useMemo, useState } from "react";
import { CommanderErrorState } from "@/features/commander-dashboard/components/CommanderErrorState";
import { CommanderRecentActivity } from "@/features/commander-dashboard/components/CommanderRecentActivity";
import { CommanderRiskPanel } from "@/features/commander-dashboard/components/CommanderRiskPanel";
import { CommanderStatusOverview } from "@/features/commander-dashboard/components/CommanderStatusOverview";
import { CommanderUrgentTable } from "@/features/commander-dashboard/components/CommanderUrgentTable";
import { commanderCaseService } from "@/features/commander-cases/services/commanderCaseService";
import { commanderDashboardService } from "@/features/commander-dashboard/services/commanderDashboardService";
import type { CommanderCase } from "@/features/commander-cases/types/commanderCase.types";
import type {
  CommanderActivity,
  CommanderDashboardOverview,
  CommanderDashboardTimelineEvent,
  CommanderReportStatus,
  CommanderRiskLevel,
  CommanderUrgentCase,
} from "@/features/commander-dashboard/types/commanderDashboard.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

function formatCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

const emptyOverview: CommanderDashboardOverview = {
  totalReports: 0,
  newReports: 0,
  underVerificationReports: 0,
  transferredReports: 0,
  resolvedReports: 0,
  spamReports: 0,
  criticalReports: 0,
  highReports: 0,
  mediumReports: 0,
  lowReports: 0,
};

function formatTimeLabel(dateValue: string) {
  return formatVietnamDateTime(dateValue);
}

function mapOverviewToStatuses(
  overview: CommanderDashboardOverview,
): CommanderReportStatus[] {
  return [
    {
      id: "total",
      label: "Tổng số",
      value: formatCount(overview.totalReports),
      tone: "total",
    },
    {
      id: "new",
      label: "Mới tiếp nhận",
      value: formatCount(overview.newReports),
      tone: "new",
    },
    {
      id: "verifying",
      label: "Đang xác minh",
      value: formatCount(overview.underVerificationReports),
      tone: "verifying",
    },
    {
      id: "investigating",
      label: "Đang điều tra",
      value: formatCount(overview.transferredReports),
      tone: "investigating",
    },
    {
      id: "resolved",
      label: "Đã xử lý",
      value: formatCount(overview.resolvedReports),
      tone: "resolved",
    },
    {
      id: "spam",
      label: "Giả / Spam",
      value: formatCount(overview.spamReports),
      tone: "spam",
    },
  ];
}

function mapOverviewToRiskLevels(
  overview: CommanderDashboardOverview,
): CommanderRiskLevel[] {
  const total =
    overview.criticalReports +
    overview.highReports +
    overview.mediumReports +
    overview.lowReports;

  const toPercent = (count: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  return [
    {
      label: "Khẩn cấp",
      count: overview.criticalReports,
      percent: toPercent(overview.criticalReports),
      tone: "urgent",
    },
    {
      label: "Cao",
      count: overview.highReports,
      percent: toPercent(overview.highReports),
      tone: "high",
    },
    {
      label: "Trung bình",
      count: overview.mediumReports,
      percent: toPercent(overview.mediumReports),
      tone: "medium",
    },
    {
      label: "Thấp",
      count: overview.lowReports,
      percent: toPercent(overview.lowReports),
      tone: "low",
    },
  ];
}

function mapTimelineToActivities(
  items: CommanderDashboardTimelineEvent[],
): CommanderActivity[] {
  return items.slice(0, 5).map((item, index) => ({
    id: `${item.caseId}-${item.createdAt}-${index}`,
    title: item.event || item.trackingCode,
    description: item.description,
    timeLabel: formatTimeLabel(item.createdAt),
    tone:
      item.urgencyLevel === "CRITICAL"
        ? "broadcast"
        : item.urgencyLevel === "HIGH"
          ? "new"
          : "verified",
  }));
}

function mapTimelineToUrgentCases(
  items: CommanderDashboardTimelineEvent[],
): CommanderUrgentCase[] {
  return items
    .filter((item) => item.urgencyLevel === "CRITICAL" || item.urgencyLevel === "HIGH")
    .slice(0, 5)
    .map((item, index) => ({
      id: `${item.caseId}-${item.createdAt}-${index}`,
      code: item.trackingCode || String(item.caseId),
      category: item.event || "Tin báo",
      location: "Chưa có toạ độ",
      status: item.urgencyLevel,
      timeLabel: formatTimeLabel(item.createdAt),
    }));
}

function mapCasesToUrgentCases(items: CommanderCase[]): CommanderUrgentCase[] {
  return items
    .slice()
    .sort(
      (left, right) =>
        new Date(right.receivedAt).getTime() - new Date(left.receivedAt).getTime(),
    )
    .slice(0, 5)
    .map((item) => ({
      id: item.code,
      code: item.code,
      category: item.category,
      location: item.location || item.coordinate || "Chưa cập nhật địa điểm",
      status: item.severity,
      timeLabel: formatTimeLabel(item.receivedAt),
    }));
}

export function CommanderDashboardContent() {
  const [overview, setOverview] = useState<CommanderDashboardOverview | null>(
    null,
  );
  const [timeline, setTimeline] = useState<CommanderDashboardTimelineEvent[]>(
    [],
  );
  const [urgentCaseItems, setUrgentCaseItems] = useState<CommanderUrgentCase[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  async function loadDashboard(showSuccess = false) {
    setIsLoading(true);
    setHasError(false);

    try {
      const [overviewData, timelineData, criticalCases, highCases] = await Promise.all([
        commanderDashboardService.getOverview(),
        commanderDashboardService.getTimeline(20),
        commanderCaseService.getCases({ severity: "CRITICAL", size: 50 }),
        commanderCaseService.getCases({ severity: "HIGH", size: 50 }),
      ]);

      setOverview(overviewData);
      setTimeline(timelineData);
      setUrgentCaseItems(
        mapCasesToUrgentCases([...criticalCases.content, ...highCases.content]),
      );

      if (showSuccess) {
        setShowToast(true);
        window.setTimeout(() => setShowToast(false), 2200);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard();
  }, []);

  const statuses = useMemo(
    () => mapOverviewToStatuses(overview ?? emptyOverview),
    [overview],
  );
  const riskLevels = useMemo(
    () => mapOverviewToRiskLevels(overview ?? emptyOverview),
    [overview],
  );
  const activities = useMemo(
    () => mapTimelineToActivities(timeline),
    [timeline],
  );
  const urgentCases = useMemo(
    () =>
      urgentCaseItems.length > 0
        ? urgentCaseItems
        : mapTimelineToUrgentCases(timeline),
    [timeline, urgentCaseItems],
  );

  return (
    <div className="relative px-8 py-8">
      {showToast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-bold text-slate-900 shadow-2xl ring-1 ring-slate-200">
          Đã cập nhật dữ liệu thành công
        </div>
      ) : null}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Tổng quan tình hình tin báo
          </h1>

          <p className="mt-3 text-slate-600">
            Theo dõi trạng thái xử lý và mức độ nguy cấp của tin báo trên toàn
            hệ thống.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
            Hôm nay
          </button>

          <button
            type="button"
            onClick={() => void loadDashboard(true)}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
          >
            Làm mới dữ liệu
          </button>
        </div>
      </section>

      {isLoading ? (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Đang tải dữ liệu từ backend...
        </section>
      ) : null}

      {hasError ? (
        <CommanderErrorState onRetry={() => void loadDashboard(true)} />
      ) : null}

      {!isLoading && !hasError ? (
        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <CommanderStatusOverview statuses={statuses} />
            <CommanderUrgentTable cases={urgentCases} />
          </div>

          <aside className="space-y-6">
            <CommanderRiskPanel levels={riskLevels} />
            <CommanderRecentActivity activities={activities} />
          </aside>
        </section>
      ) : null}
    </div>
  );
}
