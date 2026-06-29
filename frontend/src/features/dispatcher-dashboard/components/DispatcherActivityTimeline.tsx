"use client";

import { useEffect, useState } from "react";
import { dispatcherActivities } from "@/features/dispatcher-dashboard/data/dispatcherDashboard.data";
import { dispatcherDashboardService } from "@/features/dispatcher-dashboard/services/dispatcherDashboardService";
import type { DispatchActivity } from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";

const toneClassName = {
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-orange-100 text-orange-700",
};

export function DispatcherActivityTimeline() {
  const [activities, setActivities] =
    useState<DispatchActivity[]>(dispatcherActivities);

  useEffect(() => {
    let ignore = false;

    async function loadActivities() {
      try {
        const data = await dispatcherDashboardService.getActivity(8);

        if (!ignore && data.length > 0) {
          setActivities(data);
        }
      } catch {
        if (!ignore) {
          setActivities(dispatcherActivities);
        }
      }
    }

    void loadActivities();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-red-950">Dòng hoạt động</h2>

      <div className="relative mt-6 space-y-6">
        <div className="absolute bottom-0 left-5 top-0 w-px bg-red-100" />

        {activities.map((item) => (
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
                ●
              </span>
            </div>

            <div>
              <h3 className="font-black text-slate-950">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              <p className="mt-1 text-xs text-slate-400">{item.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
