"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminUrgencyRuleModal } from "@/features/admin-urgency-rules/components/AdminUrgencyRuleModal";
import { AdminUrgencyRuleStatusBadge } from "@/features/admin-urgency-rules/components/AdminUrgencyRuleStatusBadge";
import { AdminUrgencyScoreTester } from "@/features/admin-urgency-rules/components/AdminUrgencyScoreTester";
import { adminUrgencyRuleService } from "@/features/admin-urgency-rules/services/adminUrgencyRuleService";
import type {
  AdminUrgencyRule,
  AdminUrgencyRuleStatus,
} from "@/features/admin-urgency-rules/types/adminUrgencyRule.types";

type StatusFilter = "ALL" | AdminUrgencyRuleStatus;

export function AdminUrgencyRulesContent() {
  const [rules, setRules] = useState<AdminUrgencyRule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedRule, setSelectedRule] = useState<AdminUrgencyRule | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadRules() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminUrgencyRuleService.getAll();
      setRules(data);
    } catch {
      setRules([]);
      setError(
        "Không kết nối được backend urgency-rules.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRules();
  }, []);

  const filteredRules = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return rules.filter((rule) => {
      const matchedKeyword =
        keyword === "" ||
        rule.ruleCode.toLowerCase().includes(keyword) ||
        rule.title.toLowerCase().includes(keyword) ||
        rule.description.toLowerCase().includes(keyword);

      const matchedStatus =
        statusFilter === "ALL" || rule.status === statusFilter;

      return matchedKeyword && matchedStatus;
    });
  }, [rules, searchTerm, statusFilter]);

  const nextId = rules.length
    ? Math.max(...rules.map((rule) => rule.id)) + 1
    : 1;

  function openCreateModal() {
    setSelectedRule(null);
    setModalMode("create");
    setModalOpen(true);
  }

  function openEditModal(rule: AdminUrgencyRule) {
    setSelectedRule(rule);
    setModalMode("edit");
    setModalOpen(true);
  }

  async function handleSubmitRule(rule: AdminUrgencyRule) {
    try {
      const savedRule =
        modalMode === "create"
          ? await adminUrgencyRuleService.create(rule)
          : await adminUrgencyRuleService.update(rule);

      if (modalMode === "create") {
        setRules((prev) => [savedRule, ...prev]);
        showToast("Tạo quy tắc thành công");
      } else {
        setRules((prev) =>
          prev.map((item) => (item.id === savedRule.id ? savedRule : item)),
        );
        showToast("Cập nhật quy tắc thành công");
      }

      setModalOpen(false);
      setError(null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không lưu được quy tắc.",
      );
    }
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("ALL");
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          {toast}
        </div>
      ) : null}

      <AdminUrgencyRuleModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedRule}
        nextId={nextId}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitRule}
      />

      <section>
        <h1 className="text-4xl font-black text-slate-950">
          Quy tắc tính điểm nguy cấp
        </h1>

        <p className="mt-3 max-w-4xl text-slate-600">
          Thiết lập điều kiện và điểm cộng để hệ thống tự động phân loại mức độ
          ưu tiên của tin báo.
        </p>
      </section>

      {error ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-[var(--primary)]">
          {error}
        </section>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
        <div>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_auto_auto]">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm mã rule, mô tả..."
                className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Tạm dừng</option>
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg px-5 py-3 font-black text-slate-600 hover:bg-slate-100"
              >
                Đặt lại
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
              >
                + Tạo quy tắc
              </button>
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
            {isLoading ? (
              <div className="p-8 text-center font-semibold text-slate-600">
                Đang tải danh sách quy tắc...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Mã rule</th>
                      <th className="px-6 py-4">Mô tả điều kiện</th>
                      <th className="px-6 py-4">Điểm cộng</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Thao tác</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {filteredRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-700">
                          #{rule.id}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-black text-slate-900">
                            {rule.ruleCode}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {rule.title}
                          </div>
                        </td>

                        <td className="max-w-sm px-6 py-4 leading-7 text-slate-700">
                          {rule.description}
                        </td>

                        <td className="px-6 py-4 font-black text-[var(--primary)]">
                          +{rule.scoreDelta}
                        </td>

                        <td className="px-6 py-4">
                          <AdminUrgencyRuleStatusBadge status={rule.status} />
                        </td>

                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => openEditModal(rule)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100"
                          >
                            Sửa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <footer className="flex items-center justify-between border-t border-slate-200 px-6 py-4 text-sm text-slate-600">
              <p>
                Hiển thị {filteredRules.length} của {rules.length} kết quả
              </p>

              <button
                type="button"
                onClick={() => void loadRules()}
                className="rounded-md bg-[var(--primary)] px-4 py-2 font-black text-white"
              >
                Tải lại
              </button>
            </footer>
          </section>
        </div>

        <AdminUrgencyScoreTester rules={rules} />
      </div>
    </div>
  );
}
