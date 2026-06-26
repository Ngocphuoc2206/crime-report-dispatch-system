"use client";

import { useState } from "react";
import { CommanderErrorState } from "@/features/commander-dashboard/components/CommanderErrorState";
import { CommanderRecentActivity } from "@/features/commander-dashboard/components/CommanderRecentActivity";
import { CommanderRiskPanel } from "@/features/commander-dashboard/components/CommanderRiskPanel";
import { CommanderStatusOverview } from "@/features/commander-dashboard/components/CommanderStatusOverview";
import { CommanderUrgentTable } from "@/features/commander-dashboard/components/CommanderUrgentTable";

export function CommanderDashboardContent() {
  const [hasError, setHasError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function handleRefresh() {
    setHasError(false);
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 2200);
  }

  return (
    <div className="relative px-8 py-8">
      {showToast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-lg border-l-4 border-cyan-400 bg-[#2a3458] px-6 py-4 text-sm font-bold text-slate-100 shadow-xl">
          Cập nhật dữ liệu thành công
        </div>
      ) : null}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-100">
            Tổng quan tình hình tin báo
          </h1>

          <p className="mt-3 text-slate-400">
            Theo dõi trạng thái xử lý và mức bị nguy cấp của tin báo trên toàn
            hệ thống.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">
            Hôm nay
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
          >
            Làm mới dữ liệu
          </button>

          <button
            type="button"
            onClick={() => setHasError(true)}
            className="rounded-lg border border-red-300/30 px-5 py-3 text-sm font-bold text-red-200 hover:bg-red-400/10"
          >
            Test lỗi
          </button>
        </div>
      </section>

      {hasError ? (
        <CommanderErrorState onRetry={handleRefresh} />
      ) : (
        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <CommanderStatusOverview />
            <CommanderUrgentTable />
          </div>

          <aside className="space-y-6">
            <CommanderRiskPanel />
            <CommanderRecentActivity />
          </aside>
        </section>
      )}
    </div>
  );
}
