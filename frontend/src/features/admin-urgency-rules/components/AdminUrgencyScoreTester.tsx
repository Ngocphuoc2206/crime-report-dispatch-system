"use client";

import { useMemo, useState } from "react";
import type { AdminUrgencyRule } from "@/features/admin-urgency-rules/types/adminUrgencyRule.types";
import {
  getUrgencyLevelClass,
  getUrgencyLevelLabel,
  resolveUrgencyLevel,
} from "@/features/admin-urgency-rules/utils/urgencyScore.utils";

type Props = {
  rules: AdminUrgencyRule[];
};

export function AdminUrgencyScoreTester({ rules }: Props) {
  const activeRules = rules.filter((rule) => rule.status === "ACTIVE");

  const [baseScore, setBaseScore] = useState("0");
  const [selectedRules, setSelectedRules] = useState<number[]>([]);

  const totalScore = useMemo(() => {
    const base = Number(baseScore) || 0;
    const selectedScore = activeRules
      .filter((rule) => selectedRules.includes(rule.id))
      .reduce((sum, rule) => sum + rule.scoreDelta, 0);

    return base + selectedScore;
  }, [baseScore, selectedRules, activeRules]);

  const level = resolveUrgencyLevel(totalScore);

  function toggleRule(id: number) {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function handleReset() {
    setBaseScore("0");
    setSelectedRules([]);
  }

  return (
    <aside className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-2xl font-black text-slate-900">Thử tính điểm</h3>
      </header>

      <div className="space-y-5 p-5">
        <label className="block">
          <span className="text-sm font-bold text-slate-600">
            Điểm cơ sở ban đầu (Mặc định: 0)
          </span>
          <input
            type="number"
            value={baseScore}
            onChange={(e) => setBaseScore(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-red-400"
          />
        </label>

        <div>
          <p className="mb-3 text-sm font-bold text-slate-600">
            Mô phỏng các điều kiện áp dụng
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            {activeRules.map((rule, index) => (
              <label
                key={rule.id}
                className={[
                  "flex cursor-pointer items-start gap-3 px-4 py-4",
                  index !== activeRules.length - 1
                    ? "border-b border-slate-200"
                    : "",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  checked={selectedRules.includes(rule.id)}
                  onChange={() => toggleRule(rule.id)}
                  className="mt-1 h-5 w-5 rounded border-slate-300"
                />

                <div>
                  <p className="font-black text-slate-900">{rule.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    +{rule.scoreDelta} điểm
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-black text-slate-700"
          >
            Đặt lại
          </button>

          <button
            type="button"
            className="flex-1 rounded-lg border border-[var(--primary)] px-4 py-3 font-black text-[var(--primary)]"
          >
            Cập nhật kết quả
          </button>
        </div>

        <div className="rounded-xl bg-slate-50 px-5 py-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tổng điểm giả định
          </p>

          <div className="mt-3 text-5xl font-black text-slate-950">
            {totalScore}
          </div>

          <div className="mt-4">
            <span
              className={[
                "inline-flex rounded-full px-4 py-2 text-sm font-black",
                getUrgencyLevelClass(level),
              ].join(" ")}
            >
              {getUrgencyLevelLabel(level)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
