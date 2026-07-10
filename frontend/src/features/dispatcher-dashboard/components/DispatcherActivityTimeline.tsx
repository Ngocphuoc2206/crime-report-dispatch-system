"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dispatcherDashboardService } from "@/features/dispatcher-dashboard/services/dispatcherDashboardService";
import type { DispatchActivity } from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";

const dashboardActivityLimit = 8;
const requestedActivityLimit = 20;

const toneClassName = {
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-orange-100 text-orange-700",
};

export function DispatcherActivityTimeline() {
  const [activities, setActivities] = useState<DispatchActivity[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadActivities() {
      try {
        const data = await dispatcherDashboardService.getActivity(
          requestedActivityLimit,
        );

        if (!ignore) {
          setActivities(data);
        }
      } catch {
        if (!ignore) {
          setActivities([]);
        }
      }
    }

    void loadActivities();

    return () => {
      ignore = true;
    };
  }, []);

  const visibleActivities = activities.slice(0, dashboardActivityLimit);
  const hiddenActivityCount = Math.max(
    activities.length - visibleActivities.length,
    0,
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">Dòng hoạt động</h2>
          <p className="mt-1 text-xs font-semibold uppercase text-slate-500">
            {activities.length} cập nhật mới nhất
          </p>
        </div>

        <Link
          href="/dispatcher/history"
          className="rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-(--primary) transition hover:bg-red-50"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="relative mt-6 max-h-[27rem] space-y-6 overflow-y-auto pr-2">
        <div className="absolute bottom-0 left-5 top-0 w-px bg-slate-200" />

        {visibleActivities.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500">
            Hiện chưa có hoạt động điều phối.
          </p>
        ) : null}

        {visibleActivities.map((item) => (
          <article
            key={item.id}
            className="relative grid grid-cols-[2.5rem_1fr] gap-4"
          >
            <div className="relative z-10">
              <span
                className={[
                  "flex size-10 items-center justify-center rounded-full text-sm font-black",
                  toneClassName[item.tone],
                ].join(" ")}
              >
                <span className="size-2 rounded-full bg-current" />
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-950">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              <p className="mt-1 text-xs text-slate-400">{item.time}</p>
            </div>
          </article>
        ))}

        {hiddenActivityCount > 0 ? (
          <div className="relative grid grid-cols-[2.5rem_1fr] gap-4">
            <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">
              +{hiddenActivityCount}
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              Còn {hiddenActivityCount} hoạt động khác. Mở lịch sử điều phối để
              xem đầy đủ.
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
