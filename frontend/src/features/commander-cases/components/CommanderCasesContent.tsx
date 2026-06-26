"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CommanderSeverityBadge,
  CommanderStatusBadge,
} from "@/features/commander-cases/components/CommanderCaseBadges";
import {
  CommanderCaseEmptyState,
  CommanderCaseErrorState,
  CommanderCaseLoadingState,
  CommanderCaseNoResultState,
} from "@/features/commander-cases/components/CommanderCaseListStates";
import { CommanderSessionExpiredModal } from "@/features/commander-cases/components/CommanderSessionExpiredModal";
import { commanderCases } from "@/features/commander-cases/data/commanderCases.data";
import type {
  CommanderCaseSeverity,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";

type PageState = "normal" | "loading" | "empty" | "error";
type SeverityFilter = "ALL" | CommanderCaseSeverity;
type StatusFilter = "ALL" | CommanderCaseStatus;

export function CommanderCasesContent() {
  const [pageState, setPageState] = useState<PageState>("normal");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);

  const filteredCases = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return commanderCases.filter((item) => {
      const matchedKeyword =
        keyword === "" ||
        item.code.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.shortDescription.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword);

      const matchedStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const matchedSeverity =
        severityFilter === "ALL" || item.severity === severityFilter;

      return matchedKeyword && matchedStatus && matchedSeverity;
    });
  }, [searchTerm, statusFilter, severityFilter]);

  function handleReset() {
    setStatusFilter("ALL");
    setSeverityFilter("ALL");
    setSearchTerm("");
    setPageState("normal");
  }

  function handleRetry() {
    setPageState("loading");

    window.setTimeout(() => {
      setPageState("normal");
    }, 900);
  }

  return (
    <div className="px-8 py-8">
      <CommanderSessionExpiredModal
        open={sessionExpiredOpen}
        onCancel={() => setSessionExpiredOpen(false)}
        onRelock={() => setSessionExpiredOpen(false)}
      />

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-100">
            Danh sách hồ sơ
          </h1>

          <p className="mt-3 text-slate-400">
            Tra cứu và giám sát tiến độ xử lý tin báo trên toàn hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setPageState("loading")}
            className="rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            Test loading
          </button>

          <button
            type="button"
            onClick={() => setPageState("empty")}
            className="rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            Test empty
          </button>

          <button
            type="button"
            onClick={() => setPageState("error")}
            className="rounded-lg border border-red-300/40 px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-400/10"
          >
            Test error
          </button>

          <button
            type="button"
            onClick={() => setSessionExpiredOpen(true)}
            className="rounded-lg bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
          >
            Test hết phiên
          </button>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-white/10 bg-[#121b3a] p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.4fr_auto_auto]">
          <label className="block">
            <span className="text-sm font-bold text-slate-400">Trạng thái</span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="mt-2 w-full rounded-md border border-white/10 bg-[#0d1530] px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="NEW">Mới tiếp nhận</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="VERIFYING">Đang xác minh</option>
              <option value="INVESTIGATING">Điều tra</option>
              <option value="RESOLVED">Đã giải quyết</option>
              <option value="SPAM_OR_FAKE">Spam / Fake</option>
              <option value="CLOSED">Đã kết thúc</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-400">
              Mức nguy cấp
            </span>

            <select
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(event.target.value as SeverityFilter)
              }
              className="mt-2 w-full rounded-md border border-white/10 bg-[#0d1530] px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="CRITICAL">Khẩn cấp</option>
              <option value="HIGH">Cao</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="LOW">Thấp</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-400">Tìm kiếm</span>

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm mã hồ sơ, địa điểm, mô tả..."
              className="mt-2 w-full rounded-md border border-white/10 bg-[#0d1530] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
          </label>

          <button
            type="button"
            onClick={() => setPageState("normal")}
            className="self-end rounded-md bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
          >
            Áp dụng
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="self-end rounded-md border border-white/15 px-5 py-3 font-bold text-slate-300 hover:bg-white/10"
          >
            Đặt lại
          </button>
        </div>
      </section>

      <section className="mt-6">
        {pageState === "loading" ? <CommanderCaseLoadingState /> : null}

        {pageState === "empty" ? <CommanderCaseEmptyState /> : null}

        {pageState === "error" ? (
          <CommanderCaseErrorState onRetry={handleRetry} />
        ) : null}

        {pageState === "normal" && filteredCases.length === 0 ? (
          <CommanderCaseNoResultState onClear={handleReset} />
        ) : null}

        {pageState === "normal" && filteredCases.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121b3a]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-white/10 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Mã tin báo</th>
                    <th className="px-5 py-4">Loại vụ việc</th>
                    <th className="px-5 py-4">Mô tả ngắn</th>
                    <th className="px-5 py-4">Địa điểm</th>
                    <th className="px-5 py-4">Mức nguy cấp</th>
                    <th className="px-5 py-4">Trạng thái</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {filteredCases.map((item) => (
                    <tr key={item.code} className="hover:bg-white/5">
                      <td className="px-5 py-4">
                        <Link
                          href={`/commander/cases/${encodeURIComponent(
                            item.code,
                          )}`}
                          className="font-mono font-black text-cyan-300 hover:text-cyan-200"
                        >
                          {item.code}
                        </Link>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-200">
                        {item.category}
                      </td>

                      <td className="max-w-sm px-5 py-4 text-slate-400">
                        <p className="line-clamp-1">{item.shortDescription}</p>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {item.location}
                      </td>

                      <td className="px-5 py-4">
                        <CommanderSeverityBadge severity={item.severity} />
                      </td>

                      <td className="px-5 py-4">
                        <CommanderStatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="flex justify-between border-t border-white/10 px-5 py-4 text-sm text-slate-400">
              <p>
                Hiển thị 1-{filteredCases.length} trong số{" "}
                {commanderCases.length} hồ sơ
              </p>

              <p>1-20 trong số 485 ‹ ›</p>
            </footer>
          </div>
        ) : null}
      </section>
    </div>
  );
}
