"use client";

import { useState } from "react";
import { AdminDonutChart } from "@/features/admin-dashboard/components/AdminDonutChart";
import {
  AdminDashboardErrorState,
  AdminDashboardLoadingState,
} from "@/features/admin-dashboard/components/AdminDashboardStates";
import { AdminMetricCard } from "@/features/admin-dashboard/components/AdminMetricCard";
import { AdminRecentUsersTable } from "@/features/admin-dashboard/components/AdminRecentUsersTable";
import { AdminReportStatusGrid } from "@/features/admin-dashboard/components/AdminReportStatusGrid";
import type { AdminAccountMetric } from "@/features/admin-dashboard/types/adminDashboard.types";

type DashboardState = "normal" | "loading" | "error";

const emptyAccountMetrics: AdminAccountMetric[] = [
  { id: "total", label: "Tong tai khoan", value: "0", tone: "default" },
  { id: "active", label: "Dang hoat dong", value: "0", tone: "success" },
  { id: "locked", label: "Bi khoa", value: "0", tone: "danger" },
  { id: "officer", label: "Officer", value: "0", tone: "officer" },
  { id: "dispatcher", label: "Dispatcher", value: "0", tone: "dispatcher" },
  { id: "commander", label: "Commander", value: "0", tone: "commander" },
  { id: "admin", label: "Admin", value: "0", tone: "admin" },
];

export function AdminDashboardContent() {
  const [dashboardState, setDashboardState] =
    useState<DashboardState>("normal");
  const [showToast, setShowToast] = useState(false);

  function handleRefresh() {
    setDashboardState("loading");

    window.setTimeout(() => {
      setDashboardState("normal");
      setShowToast(true);

      window.setTimeout(() => {
        setShowToast(false);
      }, 2200);
    }, 900);
  }

  function handleShowError() {
    setDashboardState("error");
  }

  return (
    <div className="relative px-8 py-8">
      {showToast ? (
        <div className="fixed bottom-8 right-8 z-50 flex items-start gap-3 rounded-xl bg-white px-6 py-4 shadow-2xl ring-1 ring-slate-200">
          <span className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-700">
            ✓
          </span>

          <div>
            <p className="font-black text-slate-950">
              Cập nhật dữ liệu thành công
            </p>
            <p className="text-sm text-slate-500">
              Hệ thống đã đồng bộ phiên bản mới nhất.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="ml-4 text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>
      ) : null}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Tổng quan quản trị
          </h1>

          <p className="mt-3 text-slate-600">
            Theo dõi tài khoản người dùng, danh mục nghiệp vụ và tình hình tin
            báo trên hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Làm mới dữ liệu
          </button>

          <button
            type="button"
            onClick={handleShowError}
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black 
            text-(--primary) hover:bg-red-100"
          >
            Test lỗi
          </button>
        </div>
      </section>

      <div className="mt-8">
        {dashboardState === "loading" ? <AdminDashboardLoadingState /> : null}

        {dashboardState === "error" ? (
          <section>
            <AdminDashboardLoadingState />

            <div className="mt-10">
              <h2 className="mb-5 text-2xl font-black text-slate-950">
                Phân tích chuyên sâu
              </h2>

              <AdminDashboardErrorState onRetry={handleRefresh} />
            </div>
          </section>
        ) : null}

        {dashboardState === "normal" ? (
          <>
            <section>
              <h2 className="text-2xl font-black text-slate-950">
                Thống kê tài khoản
              </h2>

              <div className="mt-3 h-px bg-slate-200" />

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
                {emptyAccountMetrics.map((metric) => (
                  <AdminMetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            </section>

            <section className="mt-12 grid gap-6 xl:grid-cols-[1fr_24rem]">
              <AdminReportStatusGrid />
              <AdminDonutChart />
            </section>

            <section className="mt-12">
              <AdminRecentUsersTable />
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
