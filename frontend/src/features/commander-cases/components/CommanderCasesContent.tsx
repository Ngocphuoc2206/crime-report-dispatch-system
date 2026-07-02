"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SpamWarningBadge } from "@/components/ui/SpamWarningBadge";
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
import { commanderCaseService } from "@/features/commander-cases/services/commanderCaseService";
import type {
  CommanderCase,
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
  const [cases, setCases] = useState<CommanderCase[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadCases() {
    setPageState("loading");
    setApiError(null);

    try {
      const response = await commanderCaseService.getCases({
        status: statusFilter,
        severity: severityFilter,
        keyword: searchTerm,
        size: 50,
      });

      setCases(response.content);
      setTotalCases(response.totalElements);
      setPageState(response.content.length === 0 ? "empty" : "normal");
    } catch (error) {
      setCases([]);
      setTotalCases(0);
      setApiError(
        error instanceof Error
          ? error.message
          : "Không kết nối được backend danh sách hồ sơ chỉ huy.",
      );
      setPageState("error");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCases = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return cases.filter((item) => {
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
  }, [cases, searchTerm, statusFilter, severityFilter]);

  function handleReset() {
    setStatusFilter("ALL");
    setSeverityFilter("ALL");
    setSearchTerm("");
    setPageState("loading");
    setApiError(null);
    void commanderCaseService
      .getCases({ size: 50 })
      .then((response) => {
        setCases(response.content);
        setTotalCases(response.totalElements);
        setPageState(response.content.length === 0 ? "empty" : "normal");
      })
      .catch((error) => {
        setCases([]);
        setTotalCases(0);
        setApiError(
          error instanceof Error
            ? error.message
            : "Không kết nối được backend danh sách hồ sơ chỉ huy.",
        );
        setPageState("error");
      });
  }

  function handleRetry() {
    void loadCases();
  }

  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Danh sách hồ sơ
          </h1>

          <p className="mt-3 text-slate-600">
            Tra cứu và giám sát tiến độ xử lý tin báo trên toàn hệ thống.
          </p>
        </div>
      </section>

      {apiError ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-[var(--primary)]">
          {apiError}
        </section>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.4fr_auto_auto]">
          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Trạng thái hồ sơ
            </span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả trạng thái hồ sơ</option>
              <option value="NEW">Mới tiếp nhận</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="VERIFYING">Đang xác minh</option>
              <option value="INVESTIGATING">Đang điều tra</option>
              <option value="RESOLVED">Đã giải quyết</option>
              <option value="SPAM_OR_FAKE">Spam / giả mạo</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Mức nguy cấp
            </span>

            <select
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(event.target.value as SeverityFilter)
              }
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="CRITICAL">Khẩn cấp</option>
              <option value="HIGH">Cao</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="LOW">Thấp</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-600">Tìm kiếm</span>

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm mã hồ sơ, địa điểm, mô tả..."
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <button
            type="button"
            onClick={() => void loadCases()}
            className="self-end rounded-md bg-[var(--primary)] px-5 py-3 font-bold text-white hover:bg-[var(--primary-hover)]"
          >
            Áp dụng
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="self-end rounded-md border border-slate-200 px-5 py-3 font-bold text-slate-600 hover:bg-slate-50"
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
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Mã tin báo</th>
                    <th className="px-5 py-4">Loại vụ việc</th>
                    <th className="px-5 py-4">Mô tả ngắn</th>
                    <th className="px-5 py-4">Địa điểm</th>
                    <th className="px-5 py-4">Mức nguy cấp</th>
                    <th className="px-5 py-4">Trạng thái hồ sơ</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredCases.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link
                          href={`/commander/cases/${encodeURIComponent(
                            item.code,
                          )}`}
                          className="font-mono font-bold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                        >
                          {item.code}
                        </Link>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {item.category}
                      </td>

                      <td className="max-w-sm px-5 py-4 text-slate-600">
                        <p className="line-clamp-1">{item.shortDescription}</p>
                        <div className="mt-2">
                          <SpamWarningBadge
                            level={item.spamLevel}
                            score={item.spamScore}
                            reasons={item.spamReasons}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
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

            <footer className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
              <p>
                Hiển thị {filteredCases.length} trong tổng số{" "}
                {totalCases || filteredCases.length} hồ sơ
              </p>
            </footer>
          </div>
        ) : null}
      </section>
    </div>
  );
}
