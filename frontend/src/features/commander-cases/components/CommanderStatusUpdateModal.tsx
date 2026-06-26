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
  { label: "Đang xác minh", value: "VERIFYING" },
  { label: "Điều tra", value: "INVESTIGATING" },
  { label: "Đã giải quyết", value: "RESOLVED" },
  { label: "Spam / Fake", value: "SPAM_OR_FAKE" },
  { label: "Đã kết thúc", value: "CLOSED" },
];

function getStatusLabel(status: CommanderCaseStatus) {
  const map: Record<CommanderCaseStatus, string> = {
    NEW: "Mới tiếp nhận",
    PROCESSING: "Đang xử lý",
    VERIFYING: "Đang xác minh",
    INVESTIGATING: "Điều tra",
    RESOLVED: "Đã giải quyết",
    SPAM_OR_FAKE: "Spam / Fake",
    CLOSED: "Đã kết thúc",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050817]/85 px-6 backdrop-blur-sm">
      <section className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-[#111a36] shadow-2xl shadow-black/40">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl font-bold text-slate-100">
            Cập nhật trạng thái
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white"
          >
            ×
          </button>
        </header>

        <div className="p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Hồ sơ
          </p>

          <p className="mt-2 font-mono text-3xl font-black text-cyan-300">
            #{caseItem.code}
          </p>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-5 rounded-lg border border-white/10 bg-[#0d1530] p-5">
            <div>
              <p className="text-sm font-semibold text-slate-400">
                Trạng thái hiện tại
              </p>
              <p className="mt-2 font-bold text-slate-100">
                {getStatusLabel(caseItem.status)}
              </p>
            </div>

            <span className="text-2xl text-slate-300">→</span>

            <label>
              <span className="text-sm font-semibold text-slate-400">
                Trạng thái mới
              </span>

              <select
                value={nextStatus}
                onChange={(event) =>
                  setNextStatus(event.target.value as CommanderCaseStatus)
                }
                className="mt-2 w-full rounded-md border border-white/10 bg-[#202b55] px-3 py-3 text-slate-100 outline-none focus:border-cyan-400"
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
              <span className="text-sm font-bold text-slate-300">
                Ghi chú xử lý *
              </span>

              <span className="text-sm text-slate-400">
                {note.length} / 500
              </span>
            </div>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Nhập chi tiết về quyết định chuyển đổi trạng thái..."
              className="mt-3 w-full resize-none rounded-md border border-white/10 bg-[#202b55] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
          </label>

          <div className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-5">
            <p className="font-bold text-red-300">Tác động nghiệp vụ</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Hành động này sẽ gửi thông báo đến các đơn vị liên quan và khóa
              khả năng chỉnh sửa trực tiếp trên hồ sơ này.
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 px-5 py-3 font-bold text-slate-300 hover:bg-white/10"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onConfirm(nextStatus, note)}
            className="rounded-md bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400"
          >
            Xác nhận cập nhật
          </button>
        </footer>
      </section>
    </div>
  );
}
