"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  DispatcherAssignedPriorityBadge,
  DispatcherAssignedStatusBadge,
} from "@/features/dispatcher-assigned/components/DispatcherAssignedBadges";
import { DispatcherReassignUnitModal } from "@/features/dispatcher-assigned/components/DispatcherReassignUnitModal";
import { dispatcherAssignedService } from "@/features/dispatcher-assigned/services/dispatcherAssignedService";
import type {
  AssignedCase,
  ReassignUnitOption,
} from "@/features/dispatcher-assigned/types/dispatcherAssigned.types";
import { dispatcherHistoryService } from "@/features/dispatcher-history/services/dispatcherHistoryService";
import type { DispatchHistoryItem } from "@/features/dispatcher-history/types/dispatcherHistory.types";

type DispatcherAssignedDetailContentProps = {
  taskId: string;
};

const actionLabels: Record<string, string> = {
  SMART_DISPATCH: "Tự động điều phối",
  MANUAL_DISPATCH: "Điều phối thủ công",
  REASSIGN: "Đổi đơn vị",
  RECALL: "Thu hồi",
  STATUS_UPDATE: "Cập nhật trạng thái",
};

export function DispatcherAssignedDetailContent({
  taskId,
}: DispatcherAssignedDetailContentProps) {
  const router = useRouter();
  const [currentCase, setCurrentCase] = useState<AssignedCase | null>(null);
  const [historyItems, setHistoryItems] = useState<DispatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<AssignedCase | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadDetail() {
      setLoading(true);

      try {
        const [task, history] = await Promise.all([
          dispatcherAssignedService.getTask(taskId),
          dispatcherHistoryService.getHistory(100),
        ]);

        if (!ignore) {
          setCurrentCase(task);
          setHistoryItems(history);
        }
      } catch {
        if (!ignore) {
          setCurrentCase(null);
          setHistoryItems([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadDetail();

    return () => {
      ignore = true;
    };
  }, [taskId]);

  const taskHistory = useMemo(
    () => historyItems.filter((item) => item.taskId === taskId),
    [historyItems, taskId],
  );

  const canOperate =
    currentCase != null &&
    currentCase.status !== "RESOLVED" &&
    currentCase.status !== "CANCELLED";

  async function handleReassign(
    caseItem: AssignedCase,
    option: ReassignUnitOption,
    reason: string,
  ) {
    if (!option.unitId || !option.officerId) {
      showToast("Cán bộ được chọn thiếu thông tin điều phối");
      return;
    }

    try {
      const updated = await dispatcherAssignedService.reassignTask(
        caseItem.id,
        {
          assignedUnitId: option.unitId,
          assignedOfficerId: option.officerId,
          reason,
        },
      );
      const history = await dispatcherHistoryService.getHistory(100);

      setCurrentCase(updated);
      setHistoryItems(history);
      setSelectedCase(null);
      showToast(`Đã đổi đơn vị xử lý cho hồ sơ ${caseItem.caseCode}`);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : `Không thể đổi đơn vị hồ sơ ${caseItem.caseCode}`,
      );
    }
  }

  async function handleRecall() {
    if (!currentCase) return;

    try {
      await dispatcherAssignedService.recallTask(currentCase.id);

      showToast(`Đã thu hồi điều phối hồ sơ ${currentCase.caseCode}`);
      router.push(
        `/dispatcher/pending/${encodeURIComponent(currentCase.caseCode)}`,
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : `Không thể thu hồi điều phối hồ sơ ${currentCase.caseCode}`,
      );
    }
  }

  function showToast(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2400);
  }

  if (loading) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-red-200 bg-white p-8 text-sm font-semibold text-slate-600">
          Đang tải chi tiết điều phối...
        </section>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-red-200 bg-white p-8">
          <h1 className="text-3xl font-black text-[var(--primary)]">
            Không tìm thấy nhiệm vụ điều phối
          </h1>

          <p className="mt-3 text-slate-600">
            Nhiệm vụ này không tồn tại hoặc không còn được phép truy cập.
          </p>

          <Link
            href="/dispatcher/assigned"
            className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white"
          >
            Quay lại danh sách
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-red-100">
          {toast}
        </div>
      ) : null}

      <DispatcherReassignUnitModal
        open={Boolean(selectedCase)}
        assignedCase={selectedCase}
        onClose={() => setSelectedCase(null)}
        onConfirm={handleReassign}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dispatcher/assigned"
          className="text-sm font-bold text-slate-600 hover:text-[var(--primary)]"
        >
          ← Quay lại danh sách đã phân công
        </Link>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={!canOperate}
            onClick={() => setSelectedCase(currentCase)}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Đổi đơn vị
          </button>

          <button
            type="button"
            disabled={!canOperate}
            onClick={() => void handleRecall()}
            className="rounded-lg border border-orange-200 bg-white px-5 py-3 font-black text-orange-700 hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
          >
            Thu hồi
          </button>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-[var(--primary)]">
                  Nhiệm vụ điều phối
                </p>

                <h1 className="mt-2 text-4xl font-black text-slate-950">
                  #{currentCase.caseCode}
                </h1>

                <p className="mt-2 text-lg font-semibold text-slate-700">
                  {currentCase.title}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <DispatcherAssignedPriorityBadge
                  priority={currentCase.priority}
                />
                <DispatcherAssignedStatusBadge status={currentCase.status} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoBlock label="Địa điểm" value={currentCase.location} />
              <InfoBlock label="Thời gian giao" value={currentCase.assignedAt} />
              <InfoBlock label="ETA" value={currentCase.eta} />
              <InfoBlock label="SLA còn lại" value={currentCase.slaRemaining} />
            </div>
          </section>

          <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-red-950">
              Thông tin xử lý
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBlock
                label="Đơn vị đang xử lý"
                value={currentCase.assignedUnit}
              />
              <InfoBlock
                label="Cán bộ phụ trách"
                value={currentCase.assignedOfficer}
              />
            </div>

            <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
              Khi thu hồi, hệ thống hủy nhiệm vụ điều phối, trả cán bộ về trạng
              thái sẵn sàng và xóa phân công của hồ sơ bên report-service.
            </div>
          </section>
        </div>

        <aside className="rounded-xl border border-red-200 bg-white shadow-sm">
          <header className="border-b border-red-100 px-5 py-4">
            <h2 className="text-2xl font-black text-red-950">
              Nhật ký điều phối
            </h2>
          </header>

          <div className="space-y-4 p-5">
            {taskHistory.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                Chưa có lịch sử điều phối cho nhiệm vụ này.
              </div>
            ) : null}

            {taskHistory.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-red-100 bg-red-50/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-black text-slate-950">
                    {actionLabels[item.action] ?? item.action}
                  </p>
                  <span className="text-xs font-bold text-slate-500">
                    {item.createdAt}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {item.previousStatus ?? "--"} → {item.nextStatus ?? "--"}
                </p>

                <p className="mt-2 text-sm text-slate-700">{item.reason}</p>

                <p className="mt-3 text-xs font-bold uppercase text-red-800">
                  {item.actor}
                </p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-red-100 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-black text-slate-950">{value}</p>
    </div>
  );
}
