"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SpamWarningBadge } from "@/components/ui/SpamWarningBadge";
import {
  CommanderSeverityBadge,
  CommanderStatusBadge,
} from "@/features/commander-cases/components/CommanderCaseBadges";
import {
  CommanderCaseEmptyState,
  CommanderCaseErrorState,
  CommanderCaseLoadingState,
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
type CaseFilters = {
  status: StatusFilter;
  severity: SeverityFilter;
  keyword: string;
};

const PAGE_SIZE = 10;
const DEFAULT_FILTERS: CaseFilters = {
  status: "ALL",
  severity: "ALL",
  keyword: "",
};

function getVisiblePages(page: number, totalPages: number) {
  const pages = new Set([0, page - 1, page, page + 1, totalPages - 1]);

  return Array.from(pages)
    .filter((item) => item >= 0 && item < totalPages)
    .sort((left, right) => left - right);
}

export function CommanderCasesContent() {
  const [pageState, setPageState] = useState<PageState>("normal");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilters, setAppliedFilters] =
    useState<CaseFilters>(DEFAULT_FILTERS);
  const [cases, setCases] = useState<CommanderCase[]>([]);
  const [page, setPage] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadCases(
    targetPage = page,
    filters = appliedFilters,
  ) {
    setPageState("loading");
    setApiError(null);

    try {
      const response = await commanderCaseService.getCases({
        status: filters.status,
        severity: filters.severity,
        keyword: filters.keyword,
        page: targetPage,
        size: PAGE_SIZE,
      });

      setCases(response.content);
      setPage(response.number);
      setTotalCases(response.totalElements);
      setTotalPages(response.totalPages);
      setPageState(response.content.length === 0 ? "empty" : "normal");
    } catch (error) {
      setCases([]);
      setTotalCases(0);
      setTotalPages(0);
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

  function handleReset() {
    setStatusFilter("ALL");
    setSeverityFilter("ALL");
    setSearchTerm("");
    setAppliedFilters(DEFAULT_FILTERS);
    setPageState("loading");
    setApiError(null);
    void commanderCaseService
      .getCases({ page: 0, size: PAGE_SIZE })
      .then((response) => {
        setCases(response.content);
        setPage(response.number);
        setTotalCases(response.totalElements);
        setTotalPages(response.totalPages);
        setPageState(response.content.length === 0 ? "empty" : "normal");
      })
      .catch((error) => {
        setCases([]);
        setTotalCases(0);
        setTotalPages(0);
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

  function handleApplyFilters() {
    const filters = {
      status: statusFilter,
      severity: severityFilter,
      keyword: searchTerm,
    };
    setAppliedFilters(filters);
    void loadCases(0, filters);
  }

  function handlePageChange(targetPage: number) {
    if (targetPage < 0 || targetPage >= totalPages || targetPage === page) return;
    void loadCases(targetPage);
  }

  const visiblePages = getVisiblePages(page, totalPages);
  const firstItem = totalCases === 0 ? 0 : page * PAGE_SIZE + 1;
  const lastItem =
    totalCases === 0 ? 0 : Math.min(firstItem + cases.length - 1, totalCases);

  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="page-title">
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
            onClick={handleApplyFilters}
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
        {pageState === "normal" && cases.length > 0 ? (
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
                  {cases.map((item) => (
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

            <footer className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
              <p>
                Hiển thị {firstItem}-{lastItem} trong tổng số {totalCases} hồ sơ
              </p>

              <nav aria-label="Phân trang danh sách hồ sơ" className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Trang trước"
                  disabled={page <= 0}
                  onClick={() => handlePageChange(page - 1)}
                  className="rounded-md px-3 py-2 font-bold text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  ‹
                </button>

                {visiblePages.map((item, index) => {
                  const previous = visiblePages[index - 1];
                  const hasGap = previous !== undefined && item - previous > 1;

                  return (
                    <span key={item} className="flex items-center gap-2">
                      {hasGap ? <span className="px-1 text-slate-400">...</span> : null}
                      <button
                        type="button"
                        aria-label={`Trang ${item + 1}`}
                        aria-current={item === page ? "page" : undefined}
                        onClick={() => handlePageChange(item)}
                        className={[
                          "min-w-9 rounded-md px-3 py-2 font-bold",
                          item === page
                            ? "bg-slate-950 text-white"
                            : "text-slate-600 hover:bg-white",
                        ].join(" ")}
                      >
                        {item + 1}
                      </button>
                    </span>
                  );
                })}

                <button
                  type="button"
                  aria-label="Trang sau"
                  disabled={totalPages === 0 || page >= totalPages - 1}
                  onClick={() => handlePageChange(page + 1)}
                  className="rounded-md px-3 py-2 font-bold text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  ›
                </button>
              </nav>
            </footer>
          </div>
        ) : null}
      </section>
    </div>
  );
}
