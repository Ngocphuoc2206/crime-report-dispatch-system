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
        <section className="rounded-xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-[var(--primary)]">
            Khong tim thay ho so
          </h1>

          <Link
            href="/commander/cases"
            className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-6 py-3 font-bold text-white"
          >
            Quay lai danh sach
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
            title: "Cap nhat trang thai",
            description: note,
            actor: "Nguyen Van Minh - Chi huy",
            tone: nextStatus === "SPAM_OR_FAKE" ? "danger" : "success",
          },
          ...current.histories,
        ],
      };
    });

    setUpdateModalOpen(false);
    setToast("Cap nhat trang thai thanh cong");

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  return (
    <div className="px-8 py-8">
      {toast ? (
        <div className="fixed right-8 top-24 z-50 rounded-lg border-l-4 border-[var(--primary)] bg-white px-6 py-4 text-sm font-bold text-slate-900 shadow-xl">
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
        <section className="mb-6 rounded-xl border-l-4 border-slate-400 bg-white px-6 py-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Ho so nay da ket thuc xu ly va chi doc
          </h2>

          <p className="mt-2 text-slate-600">
            Tat ca thao tac cap nhat da bi vo hieu hoa. Ban chi co the xem lai
            thong tin lich su cua ho so nay.
          </p>
        </section>
      ) : null}

      <section className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/commander/cases"
            className="text-sm font-bold text-slate-500 hover:text-[var(--primary)]"
          >
            &lt; Quay lai danh sach ho so
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Ma ho so: {caseItem.code}
            </span>

            <CommanderStatusBadge status={caseItem.status} />
            <CommanderSeverityBadge severity={caseItem.severity} />
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black text-slate-950">
            {caseItem.title}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={readOnly}
            onClick={() => setUpdateModalOpen(true)}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-bold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Cap nhat
          </button>

          <button
            type="button"
            disabled={readOnly}
            className="rounded-lg border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Chuyen tiep
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Chi tiet tin bao
            </h2>

            <dl className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Nguoi bao tin
                </dt>
                <dd className="mt-2 text-slate-800">
                  {caseItem.reporter.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Thoi gian tiep nhan
                </dt>
                <dd className="mt-2 text-slate-800">
                  {formatDateTime(caseItem.receivedAt)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Phan loai he thong
                </dt>
                <dd className="mt-2 text-slate-800">{caseItem.category}</dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Do tin cay ban dau
                </dt>
                <dd className="mt-2 font-bold text-[var(--primary)]">
                  {caseItem.confidence}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <p className="text-sm font-bold uppercase text-slate-500">
                Noi dung mo ta
              </p>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-5 leading-7 text-slate-700">
                {caseItem.description}
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Du lieu dinh kem
            </h2>

            {caseItem.attachments.length === 0 ? (
              <p className="mt-5 text-slate-500">Khong co tep dinh kem.</p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {caseItem.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="font-semibold text-slate-800">{file.name}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {file.type.toUpperCase()} - {file.size}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center rounded-lg bg-slate-100 text-4xl text-slate-500">
              Map
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-950">
              Vi tri bao cao
            </h2>

            <p className="mt-3 text-slate-600">
              Toa do: {caseItem.coordinate}
            </p>

            {caseItem.locationWarning ? (
              <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-[var(--primary)]">
                Canh bao: {caseItem.locationWarning}
              </p>
            ) : null}
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Lich su xu ly</h2>

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
                        ? "bg-red-50 text-[var(--primary)]"
                        : history.tone === "success"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    •
                  </span>

                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      {history.time}
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      {history.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {history.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Boi: {history.actor}
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
