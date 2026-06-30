"use client";

import { useState } from "react";
import type {
  CommanderCase,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";

type CommanderStatusUpdateModalProps = {
  open: boolean;
  caseItem: CommanderCase;
  onClose: () => void;
  onConfirm: (nextStatus: CommanderCaseStatus, note: string) => void;
};

const nextStatusOptions: Array<{
  label: string;
  value: CommanderCaseStatus;
}> = [
  { label: "Dang xac minh", value: "VERIFYING" },
  { label: "Dieu tra", value: "INVESTIGATING" },
  { label: "Da giai quyet", value: "RESOLVED" },
  { label: "Spam / Fake", value: "SPAM_OR_FAKE" },
  { label: "Da ket thuc", value: "CLOSED" },
];

function getStatusLabel(status: CommanderCaseStatus) {
  const map: Record<CommanderCaseStatus, string> = {
    NEW: "Moi tiep nhan",
    PROCESSING: "Dang xu ly",
    VERIFYING: "Dang xac minh",
    INVESTIGATING: "Dieu tra",
    RESOLVED: "Da giai quyet",
    SPAM_OR_FAKE: "Spam / Fake",
    CLOSED: "Da ket thuc",
  };

  return map[status];
}

export function CommanderStatusUpdateModal({
  open,
  caseItem,
  onClose,
  onConfirm,
}: CommanderStatusUpdateModalProps) {
  const [nextStatus, setNextStatus] = useState<CommanderCaseStatus>("RESOLVED");
  const [note, setNote] = useState("");

  if (!open) return null;

  const canSubmit = note.trim().length > 0 && note.length <= 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-6 backdrop-blur-sm">
      <section className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-slate-950">
            Cap nhat trang thai
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-950"
          >
            x
          </button>
        </header>

        <div className="p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Ho so
          </p>

          <p className="mt-2 font-mono text-3xl font-black text-[var(--primary)]">
            #{caseItem.code}
          </p>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Trang thai hien tai
              </p>
              <p className="mt-2 font-bold text-slate-950">
                {getStatusLabel(caseItem.status)}
              </p>
            </div>

            <span className="text-2xl text-slate-400">&gt;</span>

            <label>
              <span className="text-sm font-semibold text-slate-500">
                Trang thai moi
              </span>

              <select
                value={nextStatus}
                onChange={(event) =>
                  setNextStatus(event.target.value as CommanderCaseStatus)
                }
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              >
                {nextStatusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-6 block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                Ghi chu xu ly *
              </span>

              <span className="text-sm text-slate-500">{note.length} / 500</span>
            </div>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Nhap chi tiet ve quyet dinh chuyen doi trang thai..."
              className="mt-3 w-full resize-none rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
            <p className="font-bold text-[var(--primary)]">
              Tac dong nghiep vu
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Hanh dong nay se gui thong bao den cac don vi lien quan va ghi
              nhan vao lich su xu ly.
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            Huy
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onConfirm(nextStatus, note)}
            className="rounded-md bg-[var(--primary)] px-5 py-3 font-bold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Xac nhan cap nhat
          </button>
        </footer>
      </section>
    </div>
  );
}
