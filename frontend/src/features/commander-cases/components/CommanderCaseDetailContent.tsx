"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CommanderSeverityBadge,
  CommanderStatusBadge,
} from "@/features/commander-cases/components/CommanderCaseBadges";
import { CommanderStatusUpdateModal } from "@/features/commander-cases/components/CommanderStatusUpdateModal";
import { commanderCases } from "@/features/commander-cases/data/commanderCases.data";
import type {
  CommanderCase,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";

type CommanderCaseDetailContentProps = {
  caseCode: string;
};

function findCase(caseCode: string) {
  return commanderCases.find((item) => item.code === caseCode);
}

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

export function CommanderCaseDetailContent({
  caseCode,
}: CommanderCaseDetailContentProps) {
  const initialCase = useMemo(() => findCase(caseCode), [caseCode]);
  const [caseItem, setCaseItem] = useState<CommanderCase | undefined>(
    initialCase,
  );
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!caseItem) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-red-400/30 bg-red-400/10 p-8">
          <h1 className="text-2xl font-bold text-red-200">
            Không tìm thấy hồ sơ
          </h1>

          <Link
            href="/commander/cases"
            className="mt-6 inline-flex rounded-lg bg-cyan-400 px-6 py-3 font-bold text-slate-950"
          >
            Quay lại danh sách
          </Link>
        </section>
      </div>
    );
  }

  const readOnly =
    caseItem.status === "SPAM_OR_FAKE" || caseItem.status === "CLOSED";

  function handleConfirmUpdate(nextStatus: CommanderCaseStatus, note: string) {
    setCaseItem((current) => {
      if (!current) return current;

      return {
        ...current,
        status: nextStatus,
        histories: [
          {
            id: `history-${Date.now()}`,
            time: new Intl.DateTimeFormat("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
            }).format(new Date()),
            title: "Cập nhật trạng thái",
            description: note,
            actor: "Nguyễn Văn Minh - Chỉ huy",
            tone: nextStatus === "SPAM_OR_FAKE" ? "danger" : "success",
          },
          ...current.histories,
        ],
      };
    });

    setUpdateModalOpen(false);
    setToast("Cập nhật trạng thái thành công");

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  return (
    <div className="px-8 py-8">
      {toast ? (
        <div className="fixed right-8 top-24 z-50 rounded-lg border-l-4 border-cyan-400 bg-[#2a3458] px-6 py-4 text-sm font-bold text-slate-100 shadow-xl">
          {toast}
        </div>
      ) : null}

      <CommanderStatusUpdateModal
        open={updateModalOpen}
        caseItem={caseItem}
        onClose={() => setUpdateModalOpen(false)}
        onConfirm={handleConfirmUpdate}
      />

      {readOnly ? (
        <section className="mb-6 rounded-xl border-l-4 border-slate-400 bg-white/10 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-100">
            Hồ sơ này đã kết thúc xử lý và chỉ đọc
          </h2>

          <p className="mt-2 text-slate-400">
            Tất cả thao tác cập nhật đã bị vô hiệu hóa. Bạn chỉ có thể xem lại
            thông tin lịch sử của hồ sơ này.
          </p>
        </section>
      ) : null}

      <section className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/commander/cases"
            className="text-sm font-bold text-slate-400 hover:text-cyan-300"
          >
            ← Quay lại danh sách hồ sơ
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Mã hồ sơ: {caseItem.code}
            </span>

            <CommanderStatusBadge status={caseItem.status} />
            <CommanderSeverityBadge severity={caseItem.severity} />
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black text-slate-100">
            {caseItem.title}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={readOnly}
            onClick={() => setUpdateModalOpen(true)}
            className="rounded-lg border border-white/15 px-5 py-3 font-bold text-slate-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cập nhật
          </button>

          <button
            type="button"
            disabled={readOnly}
            className="rounded-lg border border-white/15 px-5 py-3 font-bold text-slate-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Chuyển tiếp
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <article className="rounded-xl border border-white/10 bg-[#121b3a] p-6">
            <h2 className="text-2xl font-bold text-slate-100">
              Chi tiết tin báo
            </h2>

            <dl className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Người báo tin
                </dt>
                <dd className="mt-2 text-slate-200">
                  {caseItem.reporter.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Thời gian tiếp nhận
                </dt>
                <dd className="mt-2 text-slate-200">
                  {formatDateTime(caseItem.receivedAt)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Phân loại hệ thống
                </dt>
                <dd className="mt-2 text-slate-200">{caseItem.category}</dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Độ tin cậy ban đầu
                </dt>
                <dd
                  className={[
                    "mt-2 font-bold",
                    caseItem.confidence.includes("Thấp")
                      ? "text-red-200"
                      : "text-cyan-300",
                  ].join(" ")}
                >
                  {caseItem.confidence}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <p className="text-sm font-bold uppercase text-slate-500">
                Nội dung mô tả
              </p>

              <div className="mt-3 rounded-lg border border-white/10 bg-[#0d1530] p-5 leading-7 text-slate-300">
                {caseItem.description}
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-white/10 bg-[#121b3a] p-6">
            <h2 className="text-2xl font-bold text-slate-100">
              Dữ liệu đính kèm
            </h2>

            {caseItem.attachments.length === 0 ? (
              <p className="mt-5 text-slate-500">Không có tệp đính kèm.</p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {caseItem.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-lg border border-white/10 bg-[#0d1530] p-5"
                  >
                    <p className="font-semibold text-slate-200">{file.name}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {file.type.toUpperCase()} • {file.size}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-xl border border-white/10 bg-[#202642] p-6">
            <div className="flex h-40 items-center justify-center rounded-lg bg-[#11172f] text-4xl text-slate-600">
              ◌
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-100">
              Vị trí báo cáo
            </h2>

            <p className="mt-3 text-slate-400">Tọa độ: {caseItem.coordinate}</p>

            {caseItem.locationWarning ? (
              <p className="mt-4 rounded-md bg-red-400/10 px-4 py-3 text-sm font-bold text-red-200">
                Cảnh báo: {caseItem.locationWarning}
              </p>
            ) : null}
          </article>

          <article className="rounded-xl border border-white/10 bg-[#121b3a] p-6">
            <h2 className="text-2xl font-bold text-slate-100">Lịch sử xử lý</h2>

            <div className="mt-6 space-y-6">
              {caseItem.histories.map((history) => (
                <div
                  key={history.id}
                  className="grid grid-cols-[2rem_1fr] gap-4"
                >
                  <span
                    className={[
                      "mt-1 flex size-6 items-center justify-center rounded-full text-xs font-bold",
                      history.tone === "danger"
                        ? "bg-red-300 text-slate-950"
                        : history.tone === "success"
                          ? "bg-green-300 text-slate-950"
                          : "bg-slate-500 text-white",
                    ].join(" ")}
                  >
                    •
                  </span>

                  <div>
                    <p className="text-sm font-bold text-slate-400">
                      {history.time}
                    </p>

                    <p className="mt-1 font-bold text-slate-100">
                      {history.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {history.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Bởi: {history.actor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
