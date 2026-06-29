"use client";

import { useEffect, useState } from "react";
import { DispatcherActivityTimeline } from "@/features/dispatcher-dashboard/components/DispatcherActivityTimeline";
import { DispatcherLiveMapPreview } from "@/features/dispatcher-dashboard/components/DispatcherLiveMapPreview";
import { DispatcherMetricCard } from "@/features/dispatcher-dashboard/components/DispatcherMetricCard";
import { DispatcherOfficerAvailability } from "@/features/dispatcher-dashboard/components/DispatcherOfficerAvailability";
import { DispatcherPriorityQueue } from "@/features/dispatcher-dashboard/components/DispatcherPriorityQueue";
import { dispatcherMetrics } from "@/features/dispatcher-dashboard/data/dispatcherDashboard.data";
import { dispatcherDashboardService } from "@/features/dispatcher-dashboard/services/dispatcherDashboardService";
import type { DispatchMetric } from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";

export function DispatcherOverviewContent() {
  const [metrics, setMetrics] = useState<DispatchMetric[]>(dispatcherMetrics);

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
          setMetrics(dispatcherMetrics);
        }
      }
    }

    void loadMetrics();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Tong quan dieu phoi
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Theo doi trang thai dieu phoi, vu viec uu tien va luc luong dang san
            sang theo thoi gian thuc.
          </p>
        </div>

        <div className="rounded-xl bg-white px-5 py-4 font-black text-red-900 shadow-sm ring-1 ring-red-100">
          Trung tam dieu phoi
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <DispatcherMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <DispatcherPriorityQueue />

          <div className="grid gap-6 xl:grid-cols-2">
            <DispatcherLiveMapPreview />
            <DispatcherActivityTimeline />
          </div>
        </div>

        <DispatcherOfficerAvailability />
      </section>
    </div>
  );
}
