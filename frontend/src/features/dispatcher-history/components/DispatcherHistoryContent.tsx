"use client";

import { useEffect, useMemo, useState } from "react";
import { dispatcherHistoryService } from "@/features/dispatcher-history/services/dispatcherHistoryService";
import type { DispatchHistoryItem } from "@/features/dispatcher-history/types/dispatcherHistory.types";

type ActionFilter = "ALL" | string;

const actionLabels: Record<string, string> = {
  SMART_DISPATCH: "Tu dong dieu phoi",
  MANUAL_DISPATCH: "Dieu phoi thu cong",
  REASSIGN: "Doi don vi",
  RECALL: "Thu hoi",
  STATUS_UPDATE: "Cap nhat trang thai",
};

export function DispatcherHistoryContent() {
  const [items, setItems] = useState<DispatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("ALL");

  useEffect(() => {
    let ignore = false;

    async function loadHistory() {
      setLoading(true);

      try {
        const data = await dispatcherHistoryService.getHistory(100);

        if (!ignore) {
          setItems(data);
        }
      } catch {
        if (!ignore) {
          setItems([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      ignore = true;
    };
  }, []);

  const actionOptions = useMemo(
    () => Array.from(new Set(items.map((item) => item.action))),
    [items],
  );

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const matchAction = actionFilter === "ALL" || item.action === actionFilter;
      const matchKeyword =
        q === "" ||
        item.caseCode.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.assignedUnit.toLowerCase().includes(q) ||
        item.assignedOfficer.toLowerCase().includes(q) ||
        item.actor.toLowerCase().includes(q);

      return matchAction && matchKeyword;
    });
  }, [items, keyword, actionFilter]);

  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Lich su dieu phoi
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Theo doi cac lan tu dong dieu phoi, doi don vi, thu hoi va cap nhat
            trang thai cua nhiem vu.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-bold text-red-900/70">Tong ban ghi</p>
          <p className="mt-1 text-3xl font-black text-red-950">
            {items.length}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-red-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.7fr_auto]">
          <label>
            <span className="text-sm font-bold text-slate-600">
              Tim kiem ho so / don vi / can bo
            </span>

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="VD: INC-2026, PU_Q1, CB001..."
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-slate-600">Hanh dong</span>

            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tat ca hanh dong</option>
              {actionOptions.map((action) => (
                <option key={action} value={action}>
                  {actionLabels[action] ?? action}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              setKeyword("");
              setActionFilter("ALL");
            }}
            className="self-end rounded-lg border border-red-200 px-5 py-3 font-black text-slate-700 hover:bg-red-50"
          >
            Dat lai
          </button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-red-100 bg-red-50 px-5 py-4">
          <h2 className="text-2xl font-black text-red-950">
            Nhat ky dieu phoi
          </h2>

          <p className="text-sm font-bold text-red-900/70">
            {filteredItems.length} ket qua
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-320 text-left text-sm">
            <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Thoi gian</th>
                <th className="px-5 py-4">Ho so</th>
                <th className="px-5 py-4">Hanh dong</th>
                <th className="px-5 py-4">Trang thai</th>
                <th className="px-5 py-4">Don vi / can bo</th>
                <th className="px-5 py-4">Ly do</th>
                <th className="px-5 py-4">Nguon</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-red-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center font-bold text-slate-500">
                    Dang tai lich su dieu phoi...
                  </td>
                </tr>
              ) : null}

              {!loading && filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center font-bold text-slate-500">
                    Chua co lich su dieu phoi phu hop.
                  </td>
                </tr>
              ) : null}

              {!loading
                ? filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50/40">
                      <td className="px-5 py-5 font-semibold text-slate-700">
                        {item.createdAt}
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-black text-red-900">
                          #{item.caseCode}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.title} - {item.urgencyLevel}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span className="rounded-md bg-red-50 px-3 py-1 text-xs font-black text-red-800">
                          {actionLabels[item.action] ?? item.action}
                        </span>
                      </td>

                      <td className="px-5 py-5 font-bold text-slate-700">
                        {item.previousStatus ?? "--"} {"->"} {item.nextStatus ?? "--"}
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-black text-slate-900">
                          {item.assignedUnit}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.assignedOfficer}
                        </p>
                      </td>

                      <td className="max-w-sm px-5 py-5 text-slate-600">
                        {item.reason}
                      </td>

                      <td className="px-5 py-5 font-bold text-slate-700">
                        {item.actor}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
