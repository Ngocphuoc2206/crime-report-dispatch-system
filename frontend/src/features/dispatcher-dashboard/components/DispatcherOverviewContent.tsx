"use client";

import { useEffect, useState } from "react";
import { DispatcherActivityTimeline } from "@/features/dispatcher-dashboard/components/DispatcherActivityTimeline";
import { DispatcherLiveMapPreview } from "@/features/dispatcher-dashboard/components/DispatcherLiveMapPreview";
import { DispatcherMetricCard } from "@/features/dispatcher-dashboard/components/DispatcherMetricCard";
import { DispatcherOfficerAvailability } from "@/features/dispatcher-dashboard/components/DispatcherOfficerAvailability";
import { DispatcherPriorityQueue } from "@/features/dispatcher-dashboard/components/DispatcherPriorityQueue";
import { dispatcherDashboardService } from "@/features/dispatcher-dashboard/services/dispatcherDashboardService";
import type { DispatchMetric } from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";

const emptyMetrics: DispatchMetric[] = [
  { id: "waiting", label: "Tin cho dieu phoi", value: "0", description: "Nguon tu dispatch-service", tone: "default" },
  { id: "critical", label: "Vu viec khan cap", value: "0", description: "Can dieu phoi ngay", tone: "danger" },
  { id: "available", label: "Can bo san sang", value: "0 / 0", description: "Nguon tu dispatch-service", tone: "success" },
  { id: "assigned", label: "Da phan cong", value: "0", description: "Task dang hoat dong", tone: "warning" },
  { id: "completed", label: "Da xu ly", value: "0", description: "Task hoan tat", tone: "success" },
];

export function DispatcherOverviewContent() {
  const [metrics, setMetrics] = useState<DispatchMetric[]>(emptyMetrics);

  useEffect(() => {
    let ignore = false;

    async function loadMetrics() {
      try {
        const data = await dispatcherDashboardService.getMetrics();

        if (!ignore) {
          setMetrics(data);
        }
      } catch {
        if (!ignore) {
          setMetrics(emptyMetrics);
        }
      }
    }

    void loadMetrics();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="page-shell">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="page-title">
            Tổng quan điều phối
          </h1>

          <p className="page-description">
            Theo dõi trạng thái điều phối, vụ việc ưu tiên và lực lượng sẵn
            sàng theo thời gian thực.
          </p>
        </div>

        <div className="app-button border border-red-200 bg-white text-(--primary)">
          Trung tâm điều phối
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <DispatcherMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <DispatcherPriorityQueue />

          <div className="grid items-start gap-6 xl:grid-cols-2">
            <DispatcherLiveMapPreview />
            <DispatcherActivityTimeline />
          </div>
        </div>

        <DispatcherOfficerAvailability />
      </section>
    </div>
  );
}
