"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dispatcherPriorityCases } from "@/features/dispatcher-dashboard/data/dispatcherDashboard.data";
import type {
  DispatchPriorityCase,
  DispatchPriorityLevel,
} from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";
import { dispatcherDashboardService } from "@/features/dispatcher-dashboard/services/dispatcherDashboardService";

const priorityConfig: Record<
  DispatchPriorityLevel,
  {
    label: string;
    className: string;
  }
> = {
  CRITICAL: {
    label: "Khẩn cấp",
    className: "bg-[var(--primary)] text-white",
  },
  HIGH: {
    label: "Cao",
    className: "bg-orange-500 text-white",
  },
  MEDIUM: {
    label: "Trung bình",
    className: "bg-yellow-400 text-slate-900",
  },
  LOW: {
    label: "Thấp",
    className: "bg-slate-100 text-slate-700",
  },
};

export function DispatcherPriorityQueue() {
  const [cases, setCases] =
    useState<DispatchPriorityCase[]>(dispatcherPriorityCases);

  useEffect(() => {
    let ignore = false;

    async function loadCases() {
      try {
        const data = await dispatcherDashboardService.getPriorityQueue();

        if (!ignore && data.length > 0) {
          setCases(data);
        }
      } catch {
        if (!ignore) {
          setCases(dispatcherPriorityCases);
        }
      }
    }

    void loadCases();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-red-100 bg-red-50 px-5 py-4">
        <h2 className="text-2xl font-black text-red-950">Hàng đợi ưu tiên</h2>

        <Link
          href="/dispatcher/pending"
          className="font-black text-(--primary) hover:underline"
        >
          Xem tất cả →
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Mã vụ việc</th>
              <th className="px-5 py-4">Loại hình</th>
              <th className="px-5 py-4">Mức độ</th>
              <th className="px-5 py-4">Vị trí</th>
              <th className="px-5 py-4">Thời gian</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-red-100">
            {cases.map((item) => {
              const priority = priorityConfig[item.priority];

              return (
                <tr key={item.id} className="hover:bg-red-50/60">
                  <td className="px-5 py-5 font-black text-red-900">
                    #{item.caseCode}
                  </td>

                  <td className="px-5 py-5 text-slate-700">{item.type}</td>

                  <td className="px-5 py-5">
                    <span
                      className={[
                        "inline-flex rounded-md px-3 py-2 text-xs font-black uppercase",
                        priority.className,
                      ].join(" ")}
                    >
                      {priority.label}
                    </span>
                  </td>

                  <td className="px-5 py-5 text-slate-700">{item.location}</td>

                  <td className="px-5 py-5 text-slate-600">
                    {item.createdAt}
                    <span className="block text-xs text-slate-400">
                      Chờ {item.waitingTime}
                    </span>
                  </td>

                  <td className="px-5 py-5 text-right">
                    <Link
                      href={`/dispatcher/pending/${encodeURIComponent(
                        item.caseCode,
                      )}`}
                      className="rounded-lg border border-red-200 px-4 py-2 
                      font-bold text-(--primary) hover:bg-red-50"
                    >
                      Điều phối
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
