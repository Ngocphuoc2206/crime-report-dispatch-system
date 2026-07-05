"use client";

import { useEffect, useState } from "react";
import type {
  AdminUrgencyRule,
  AdminUrgencyRuleStatus,
} from "@/features/admin-urgency-rules/types/adminUrgencyRule.types";

type AdminUrgencyRuleModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: AdminUrgencyRule | null;
  nextId?: number;
  onClose: () => void;
  onSubmit: (rule: AdminUrgencyRule) => void | Promise<void>;
};

export function AdminUrgencyRuleModal({
  open,
  mode,
  initialData,
  nextId = 1,
  onClose,
  onSubmit,
}: AdminUrgencyRuleModalProps) {
  const [ruleCode, setRuleCode] = useState("");
  const [description, setDescription] = useState("");
  const [scoreDelta, setScoreDelta] = useState("");
  const [status, setStatus] = useState<AdminUrgencyRuleStatus>("ACTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRuleCode(initialData.ruleCode);
      setDescription(initialData.description);
      setScoreDelta(String(initialData.scoreDelta));
      setStatus(initialData.status);
      return;
    }

    if (mode === "create") {
      setRuleCode("");
      setDescription("");
      setScoreDelta("");
      setStatus("ACTIVE");
    }
  }, [mode, initialData, open]);

  if (!open) return null;

  const canSubmit =
    ruleCode.trim() && description.trim() && Number(scoreDelta) > 0;

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) return;

    const normalizedRuleCode = ruleCode.trim().toUpperCase();
    const rule: AdminUrgencyRule = {
      id: mode === "edit" && initialData ? initialData.id : nextId,
      ruleCode: normalizedRuleCode,
      title: normalizedRuleCode,
      description: description.trim(),
      scoreDelta: Number(scoreDelta),
      status,
    };

    setIsSubmitting(true);

    try {
      await onSubmit(rule);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {mode === "create" ? "Tạo quy tắc" : "Chỉnh sửa quy tắc"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Thiết lập điều kiện cộng điểm nguy cấp cho tin báo.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-slate-900"
          >
            ×
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="text-sm font-black text-slate-700">
                Mã rule *
              </span>
              <input
                value={ruleCode}
                onChange={(e) => setRuleCode(e.target.value)}
                placeholder="VD: RULE_WEAPON"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Trạng thái
              </span>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as AdminUrgencyRuleStatus)
                }
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Tạm dừng</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-black text-slate-700">
              Mô tả điều kiện *
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Nhập mô tả điều kiện áp dụng..."
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-700">
              Điểm cộng *
            </span>
            <input
              type="number"
              value={scoreDelta}
              onChange={(e) => setScoreDelta(e.target.value)}
              placeholder="VD: 50"
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-slate-700">
            <strong>Lưu ý:</strong> Điểm cộng này sẽ được cộng vào điểm cơ sở
            của tin báo khi điều kiện tương ứng được thỏa mãn.
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-3 font-black text-slate-700"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!canSubmit || isSubmitting}
            onClick={() => void handleSubmit()}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting
              ? "Đang lưu..."
              : mode === "create"
                ? "Tạo quy tắc"
                : "Lưu thay đổi"}
          </button>
        </footer>
      </section>
    </div>
  );
}
