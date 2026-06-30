"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CommanderSeverityBadge,
  CommanderStatusBadge,
} from "@/features/commander-cases/components/CommanderCaseBadges";
import { CommanderStatusUpdateModal } from "@/features/commander-cases/components/CommanderStatusUpdateModal";
import { commanderCaseService } from "@/features/commander-cases/services/commanderCaseService";
import type {
  CommanderCase,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";

type CommanderCaseDetailContentProps = {
  caseCode: string;
};

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
  const [caseItem, setCaseItem] = useState<CommanderCase | undefined>(undefined);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDetail() {
    setIsLoading(true);
    setError(null);

    try {
      const detail = await commanderCaseService.getDetail(caseCode);
      setCaseItem(detail);
    } catch (loadError) {
      setCaseItem(undefined);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Khong ket noi duoc backend commander case detail.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseCode]);

  if (isLoading) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Dang tai chi tiet ho so...
        </section>
      </div>
    );
  }

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

  const activeCase = caseItem;
  const readOnly =
    activeCase.status === "SPAM_OR_FAKE" || activeCase.status === "CLOSED";

  function handleConfirmUpdate(nextStatus: CommanderCaseStatus, note: string) {
    void commanderCaseService
      .updateStatus(activeCase.code, nextStatus, note)
      .then((updatedCase) => {
        setCaseItem(updatedCase);
        setUpdateModalOpen(false);
        setToast("Cap nhat trang thai thanh cong");
        window.setTimeout(() => setToast(null), 2200);
      })
      .catch((updateError) => {
        setError(
          updateError instanceof Error
            ? updateError.message
            : "Khong cap nhat duoc trang thai.",
        );
      });
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
        caseItem={activeCase}
        onClose={() => setUpdateModalOpen(false)}
        onConfirm={handleConfirmUpdate}
      />

      {error ? (
        <section className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-[var(--primary)]">
          {error}
        </section>
      ) : null}

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
              Ma ho so: {activeCase.code}
            </span>

            <CommanderStatusBadge status={activeCase.status} />
            <CommanderSeverityBadge severity={activeCase.severity} />
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black text-slate-950">
            {activeCase.title}
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
                  {activeCase.reporter.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Thoi gian tiep nhan
                </dt>
                <dd className="mt-2 text-slate-800">
                  {formatDateTime(activeCase.receivedAt)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Phan loai he thong
                </dt>
                <dd className="mt-2 text-slate-800">{activeCase.category}</dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Do tin cay ban dau
                </dt>
                <dd className="mt-2 font-bold text-[var(--primary)]">
                  {activeCase.confidence}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <p className="text-sm font-bold uppercase text-slate-500">
                Noi dung mo ta
              </p>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-5 leading-7 text-slate-700">
                {activeCase.description}
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Du lieu dinh kem
            </h2>

            {activeCase.attachments.length === 0 ? (
              <p className="mt-5 text-slate-500">Khong co tep dinh kem.</p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {activeCase.attachments.map((file) => (
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
              Toa do: {activeCase.coordinate}
            </p>

            {activeCase.locationWarning ? (
              <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-[var(--primary)]">
                Canh bao: {activeCase.locationWarning}
              </p>
            ) : null}
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Lich su xu ly</h2>

            <div className="mt-6 space-y-6">
              {activeCase.histories.map((history) => (
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
