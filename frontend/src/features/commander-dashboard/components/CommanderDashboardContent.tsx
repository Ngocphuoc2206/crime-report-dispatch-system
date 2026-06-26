"use client";

import { useEffect, useMemo, useState } from "react";
import { CommanderErrorState } from "@/features/commander-dashboard/components/CommanderErrorState";
import { CommanderRecentActivity } from "@/features/commander-dashboard/components/CommanderRecentActivity";
import { CommanderRiskPanel } from "@/features/commander-dashboard/components/CommanderRiskPanel";
import { CommanderStatusOverview } from "@/features/commander-dashboard/components/CommanderStatusOverview";
import { CommanderUrgentTable } from "@/features/commander-dashboard/components/CommanderUrgentTable";
import {
  commanderActivities,
  commanderReportStatuses,
  commanderRiskLevels,
  commanderUrgentCases,
} from "@/features/commander-dashboard/data/commanderDashboard.data";
import { commanderDashboardService } from "@/features/commander-dashboard/services/commanderDashboardService";
import type {
  CommanderActivity,
  CommanderDashboardOverview,
  CommanderDashboardTimelineEvent,
  CommanderReportStatus,
  CommanderRiskLevel,
  CommanderUrgentCase,
} from "@/features/commander-dashboard/types/commanderDashboard.types";

function formatCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatTimeLabel(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Vua cap nhat";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

function mapOverviewToStatuses(
  overview: CommanderDashboardOverview,
): CommanderReportStatus[] {
  return [
    {
      id: "total",
      label: "Tong so",
      value: formatCount(overview.totalReports),
      tone: "total",
    },
    {
      id: "new",
      label: "Moi tiep nhan",
      value: formatCount(overview.newReports),
      tone: "new",
    },
    {
      id: "verifying",
      label: "Dang xac minh",
      value: formatCount(overview.underVerificationReports),
      tone: "verifying",
    },
    {
      id: "investigating",
      label: "Da dieu phoi",
      value: formatCount(overview.transferredReports),
      tone: "investigating",
    },
    {
      id: "resolved",
      label: "Da xu ly",
      value: formatCount(overview.resolvedReports),
      tone: "resolved",
    },
    {
      id: "spam",
      label: "Gia / Spam",
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
      label: "Khan cap",
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
      label: "Trung binh",
      count: overview.mediumReports,
      percent: toPercent(overview.mediumReports),
      tone: "medium",
    },
    {
      label: "Thap",
      count: overview.lowReports,
      percent: toPercent(overview.lowReports),
      tone: "low",
    },
  ];
}

function mapTimelineToActivities(
  items: CommanderDashboardTimelineEvent[],
): CommanderActivity[] {
  return items.slice(0, 5).map((item) => ({
    id: String(item.caseId),
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
    .map((item) => ({
      id: String(item.caseId),
      code: item.trackingCode || String(item.caseId),
      category: item.event || "Tin bao",
      location: "Chua co toa do",
      status: item.urgencyLevel,
      timeLabel: formatTimeLabel(item.createdAt),
    }));
}

export function CommanderDashboardContent() {
  const [overview, setOverview] = useState<CommanderDashboardOverview | null>(
    null,
  );
  const [timeline, setTimeline] = useState<CommanderDashboardTimelineEvent[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  async function loadDashboard(showSuccess = false) {
    setIsLoading(true);
    setHasError(false);

    try {
      const [overviewData, timelineData] = await Promise.all([
        commanderDashboardService.getOverview(),
        commanderDashboardService.getTimeline(20),
      ]);

      setOverview(overviewData);
      setTimeline(timelineData);

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
    () => (overview ? mapOverviewToStatuses(overview) : commanderReportStatuses),
    [overview],
  );
  const riskLevels = useMemo(
    () => (overview ? mapOverviewToRiskLevels(overview) : commanderRiskLevels),
    [overview],
  );
  const activities = useMemo(
    () =>
      timeline.length > 0 ? mapTimelineToActivities(timeline) : commanderActivities,
    [timeline],
  );
  const urgentCases = useMemo(
    () =>
      timeline.length > 0
        ? mapTimelineToUrgentCases(timeline)
        : commanderUrgentCases,
    [timeline],
  );

  return (
    <div className="relative px-8 py-8">
      {showToast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          Da cap nhat du lieu thanh cong
        </div>
      ) : null}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Tong quan tinh hinh tin bao
          </h1>

          <p className="mt-3 text-slate-600">
            Theo doi trang thai xu ly va muc do nguy cap cua tin bao tren toan
            he thong.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
            Hom nay
          </button>

          <button
            type="button"
            onClick={() => void loadDashboard(true)}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
          >
            Lam moi du lieu
          </button>
        </div>
      </section>

      {isLoading ? (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Dang tai du lieu tu backend...
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
