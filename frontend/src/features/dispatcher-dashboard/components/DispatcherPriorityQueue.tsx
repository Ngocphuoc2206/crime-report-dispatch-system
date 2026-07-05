"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SpamWarningBadge } from "@/components/ui/SpamWarningBadge";
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
  const [cases, setCases] = useState<DispatchPriorityCase[]>([]);

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
          setCases([]);
        }
      }
    }

    void loadCases();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">Hàng đợi ưu tiên</h2>

        <Link
          href="/dispatcher/pending"
          className="text-sm font-bold text-(--primary) hover:text-(--primary-hover)"
        >
          Xem tất cả
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="bg-red-50/50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Mã vụ việc</th>
              <th className="px-5 py-4">Loại hình</th>
              <th className="px-5 py-4">Mức độ</th>
              <th className="px-5 py-4">Vị trí</th>
              <th className="px-5 py-4">Thời gian</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {cases.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm font-semibold text-slate-500">
                  Hiện chưa có tin báo ưu tiên trong hàng đợi.
                </td>
              </tr>
            ) : null}

            {cases.map((item) => {
              const priority = priorityConfig[item.priority];

              return (
                <tr key={item.id} className="hover:bg-red-50/40">
                  <td className="px-5 py-5 font-bold text-slate-900">
                    #{item.caseCode}
                  </td>

                  <td className="px-5 py-5 text-slate-700">
                    <div>{item.type}</div>
                    <div className="mt-2">
                      <SpamWarningBadge
                        level={item.spamLevel}
                        score={item.spamScore}
                        reasons={item.spamReasons}
                      />
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={[
                        "inline-flex rounded-md px-3 py-2 text-xs font-bold uppercase",
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
                      className="rounded-lg border border-red-200 px-4 py-2 font-bold text-(--primary) hover:bg-red-50"
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
