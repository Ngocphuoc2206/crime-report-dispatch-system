"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DispatcherCaseMap } from "@/features/dispatcher-pending/components/DispatcherCaseMap";
import { DispatcherPriorityBadge } from "@/features/dispatcher-pending/components/DispatcherPriorityBadge";
import { DispatcherRecommendedUnits } from "@/features/dispatcher-pending/components/DispatcherRecommendedUnits";
import { dispatcherPendingService } from "@/features/dispatcher-pending/services/dispatcherPendingService";
import type { PendingDispatchCase } from "@/features/dispatcher-pending/types/dispatcherPending.types";

type DispatcherPendingDetailContentProps = {
  caseCode: string;
};

export function DispatcherPendingDetailContent({
  caseCode,
}: DispatcherPendingDetailContentProps) {
  const [note, setNote] = useState("");
  const [currentCase, setCurrentCase] = useState<PendingDispatchCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadCase() {
      setLoading(true);

      try {
        const data = await dispatcherPendingService.getDetail(caseCode);

        if (!ignore && data) {
          setCurrentCase(data);
        }
      } catch {
        if (!ignore) {
          setCurrentCase(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadCase();

    return () => {
      ignore = true;
    };
  }, [caseCode]);

  if (loading) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-red-200 bg-white p-8 text-sm font-semibold text-slate-600">
          Đang tải chi tiết tin báo...
        </section>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-red-200 bg-white p-8">
          <h1 className="text-3xl font-black text-[var(--primary)]">
            Không tìm thấy tin báo
          </h1>

          <p className="mt-3 text-slate-600">
            Tin báo này không tồn tại hoặc đã được điều phối.
          </p>

          <Link
            href="/dispatcher/pending"
            className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white"
          >
            Quay lại hàng đợi
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <section className="grid gap-6 xl:grid-cols-[19rem_1fr_25rem]">
        <aside className="overflow-hidden rounded-xl border border-red-200 bg-red-50/70 shadow-sm">
          <header className="flex items-center justify-between border-b border-red-200 px-5 py-4">
            <div>
              <p className="text-sm font-bold text-red-900/70">Tin báo</p>
              <h1 className="text-2xl font-black text-red-950">
                #{currentCase.caseCode}
              </h1>
            </div>

            <DispatcherPriorityBadge priority={currentCase.priority} />
          </header>

          <div className="space-y-6 p-5">
            <div>
              <p className="text-sm font-bold text-slate-500">Loại vụ việc</p>

              <p className="mt-2 text-xl font-black text-slate-950">
                {currentCase.title}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">Địa điểm</p>

              <div className="mt-2 rounded-lg border border-red-200 bg-white p-4 text-lg leading-8 text-slate-800">
                {currentCase.location}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">Mô tả</p>

              <p className="mt-2 leading-7 text-slate-700">
                {currentCase.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-red-200 bg-white p-4">
                <p className="text-xs text-slate-500">Giờ báo tin</p>
                <p className="mt-1 font-black text-slate-950">
                  {currentCase.createdAt}
                </p>
              </div>

              <div className="rounded-lg border border-red-200 bg-white p-4">
                <p className="text-xs text-slate-500">Người báo</p>
                <p className="mt-1 font-black text-slate-950">
                  {currentCase.reporterType}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">
                Bằng chứng đính kèm
              </p>

              <div className="mt-3 flex gap-3">
                <div className="flex size-20 items-center justify-center rounded-lg border border-red-200 bg-red-100 text-2xl">
                  🎙
                </div>

                <div className="flex size-20 items-center justify-center rounded-lg border border-red-200 bg-red-100 text-2xl">
                  🖼
                </div>
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-slate-500">
                Ghi chú điều phối nội bộ
              </span>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder="Nhập ghi chú cho đơn vị tiếp nhận..."
                className="mt-2 w-full resize-none rounded-lg border border-red-200 bg-white px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              />
            </label>
          </div>
        </aside>

        <DispatcherCaseMap />

        <DispatcherRecommendedUnits caseCode={currentCase.caseCode} />
      </section>
    </div>
  );
}
