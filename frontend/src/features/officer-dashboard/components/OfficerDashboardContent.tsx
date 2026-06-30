/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  OfficerCasePriorityBadge,
  OfficerCaseStatusBadge,
} from "@/features/officer-cases/components/OfficerCaseBadge";
import { officerCaseService } from "@/features/officer-cases/services/officerCaseService";
import type { OfficerCase } from "@/features/officer-cases/types/officerCase.types";

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function OfficerDashboardContent() {
  const [cases, setCases] = useState<OfficerCase[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCases = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await officerCaseService.getCases({ page: 0, size: 100 });
      setCases(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      setCases([]);
      setTotalElements(0);
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tải dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCases();
  }, [loadCases]);

  const metrics = useMemo(() => {
    const newCases = cases.filter((item) => item.status === "NEW_RECEIVED");
    const verifyingCases = cases.filter(
      (item) => item.status === "UNDER_VERIFICATION",
    );
    const resolvedCases = cases.filter((item) => item.status === "RESOLVED");
    const criticalCases = cases.filter((item) => item.priority === "CRITICAL");

    return [
      {
        label: "Tổng hồ sơ",
        value: totalElements,
        tone: "text-slate-950",
      },
      {
        label: "Mới tiếp nhận",
        value: newCases.length,
        tone: "text-sky-700",
      },
      {
        label: "Đang xác minh",
        value: verifyingCases.length,
        tone: "text-blue-700",
      },
      {
        label: "Khẩn cấp",
        value: criticalCases.length,
        tone: "text-(--primary)",
      },
      {
        label: "Đã xử lý",
        value: resolvedCases.length,
        tone: "text-green-700",
      },
    ];
  }, [cases, totalElements]);

  const highPriorityCases = cases
    .filter((item) => item.priority === "CRITICAL" || item.priority === "HIGH")
    .slice(0, 5);

  const recentCases = cases.slice(0, 8);

  return (
    <div className="px-6 py-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Bảng điều khiển tổng quan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Dữ liệu được lấy từ danh sách hồ sơ officer trên backend.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCases()}
          className="rounded-md border border-red-200 bg-white px-5 py-3 text-sm font-bold text-(--primary) transition hover:bg-red-50"
        >
          Tải lại dữ liệu
        </button>
      </section>

      {errorMessage ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-(--primary)">
          {errorMessage}
        </section>
      ) : null}

      {isLoading ? (
        <section className="mt-8 rounded-xl border border-(--border) bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Đang tải dashboard...
        </section>
      ) : (
        <>
          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <p className="text-sm font-bold uppercase text-slate-500">
                  {metric.label}
                </p>
                <p className={`mt-4 text-4xl font-bold ${metric.tone}`}>
                  {metric.value}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
            <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
              <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Hồ sơ gần đây
                </h2>
                <Link
                  href="/officer/cases"
                  className="text-sm font-bold text-(--primary) hover:text-(--primary-hover)"
                >
                  Xem tất cả
                </Link>
              </header>

              <div className="overflow-x-auto">
                <table className="w-full min-w-190 text-left text-sm">
                  <thead className="bg-red-50/50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Thời gian</th>
                      <th className="px-6 py-4">Mã hồ sơ</th>
                      <th className="px-6 py-4">Nội dung</th>
                      <th className="px-6 py-4">Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {recentCases.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {formatDateTime(item.submittedAt)}
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-900">
                          {item.code}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {item.title}
                        </td>

                        <td className="px-6 py-4">
                          <OfficerCaseStatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <aside className="rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
              <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Ưu tiên cao
                </h2>

                <span className="rounded bg-(--primary) px-3 py-1 text-xs font-bold text-white shadow-sm shadow-red-950/10">
                  {highPriorityCases.length} hồ sơ
                </span>
              </header>

              <div className="divide-y divide-slate-200">
                {highPriorityCases.length === 0 ? (
                  <p className="p-5 text-sm font-semibold text-slate-600">
                    Không có hồ sơ ưu tiên cao.
                  </p>
                ) : (
                  highPriorityCases.map((item) => (
                    <Link
                      key={item.id}
                      href={`/officer/cases/${encodeURIComponent(item.id)}`}
                      className="block p-5 transition hover:bg-red-50/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-bold text-slate-900">{item.code}</p>
                        <OfficerCasePriorityBadge priority={item.priority} />
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-700">
                        {item.title}: {item.summary}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}
