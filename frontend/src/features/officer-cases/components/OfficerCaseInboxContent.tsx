/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SpamWarningBadge } from "@/components/ui/SpamWarningBadge";
import {
  OfficerCasePriorityBadge,
  OfficerCaseStatusBadge,
} from "@/features/officer-cases/components/OfficerCaseBadge";
import { officerCaseService } from "@/features/officer-cases/services/officerCaseService";
import type {
  OfficerCase,
  OfficerCasePage,
  OfficerCasePriority,
  OfficerCaseStatus,
} from "@/features/officer-cases/types/officerCase.types";

type StatusFilter = "ALL" | OfficerCaseStatus;
type UrgencyFilter = "ALL" | OfficerCasePriority;

const PAGE_SIZE = 20;

const emptyPage: OfficerCasePage<OfficerCase> = {
  content: [],
  number: 0,
  size: PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

export function OfficerCaseInboxContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("ALL");
  const [page, setPage] = useState(0);
  const [casePage, setCasePage] = useState(emptyPage);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCases = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await officerCaseService.getCases({
        status: statusFilter,
        urgencyLevel: urgencyFilter,
        page,
        size: PAGE_SIZE,
      });
      setCasePage(response);
    } catch (error) {
      setCasePage(emptyPage);
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tải hồ sơ.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, urgencyFilter]);

  useEffect(() => {
    void loadCases();
  }, [loadCases]);

  const filteredCases = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return casePage.content.filter((item) => {
      return (
        keyword === "" ||
        item.code.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.summary.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword)
      );
    });
  }, [casePage.content, searchTerm]);

  const newCount = casePage.content.filter(
    (item) => item.status === "NEW_RECEIVED",
  ).length;
  const verifyingCount = casePage.content.filter(
    (item) => item.status === "UNDER_VERIFICATION",
  ).length;
  const urgentCount = casePage.content.filter(
    (item) => item.priority === "CRITICAL",
  ).length;

  function resetPage() {
    setPage(0);
  }

  return (
    <div className="min-w-0 px-4 py-6 sm:px-6 sm:py-8">
      <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="page-title">
            Danh sách tin báo được giao
          </h1>

          <p className="mt-2 text-slate-600">
            Quản lý và xử lý các thông tin phản ánh từ người dân.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCases()}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-(--border) bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-red-50 hover:text-(--primary) sm:w-auto"
        >
          Tải lại dữ liệu
        </button>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-slate-500">Tổng số</p>
          <p className="mt-4 text-4xl font-bold text-slate-950">
            {casePage.totalElements}
          </p>
        </article>

        <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-slate-500">
            Mới tiếp nhận
          </p>
          <p className="mt-4 text-4xl font-bold text-slate-950">{newCount}</p>
        </article>

        <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-slate-500">
            Đang xác minh
          </p>
          <p className="mt-4 text-4xl font-bold text-blue-700">
            {verifyingCount}
          </p>
        </article>

        <article className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-(--primary)">
            Khẩn cấp
          </p>
          <p className="mt-4 text-4xl font-bold text-(--primary)">
            {urgentCount}
          </p>
        </article>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-(--border) bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-(--border) p-5 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm nội dung, mã hồ sơ, địa điểm..."
            className="w-full rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100 lg:w-96"
          />

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
                resetPage();
              }}
              className="w-full min-w-0 rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100 sm:w-auto"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="NEW_RECEIVED">Mới tiếp nhận</option>
              <option value="UNDER_VERIFICATION">Đang xác minh</option>
              <option value="TRANSFERRED_TO_INVESTIGATION">
                Chuyển điều tra
              </option>
              <option value="RESOLVED">Đã xử lý</option>
              <option value="SPAM_OR_FAKE">Hồ sơ giả / Spam</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={(event) => {
                setUrgencyFilter(event.target.value as UrgencyFilter);
                resetPage();
              }}
              className="w-full min-w-0 rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100 sm:w-auto"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="CRITICAL">Khẩn cấp</option>
              <option value="HIGH">Cao</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="LOW">Thấp</option>
            </select>
          </div>
        </div>

        {errorMessage ? (
          <div className="border-b border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-(--primary)">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="p-8 text-center font-semibold text-slate-600">
            Đang tải danh sách hồ sơ...
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="p-8 text-center font-semibold text-slate-600">
            Không có hồ sơ phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Mã tin báo</th>
                  <th className="px-5 py-4">Nội dung</th>
                  <th className="px-5 py-4">Địa điểm</th>
                  <th className="px-5 py-4">Mức nguy cấp</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4">Cán bộ</th>
                  <th className="px-5 py-4">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-(--border)">
                {filteredCases.map((item) => (
                  <tr key={item.id} className="hover:bg-red-50/40">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {item.code}
                    </td>

                    <td className="max-w-md px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-slate-600">
                        {item.summary}
                      </p>
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
                      <OfficerCasePriorityBadge priority={item.priority} />
                    </td>

                    <td className="px-5 py-4">
                      <OfficerCaseStatusBadge status={item.status} />
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.assignedOfficerName ?? "Chưa phân công"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <Link
                        href={`/officer/cases/${encodeURIComponent(item.id)}`}
                        className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-md border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:border-(--primary) hover:bg-red-50 hover:text-(--primary)"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="flex flex-col gap-4 border-t border-(--border) bg-slate-50 px-5 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            Hiển thị {filteredCases.length} / {casePage.totalElements} hồ sơ
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              className="rounded-md px-3 py-2 text-slate-600 disabled:text-slate-400"
            >
              ‹
            </button>
            <span className="rounded-md bg-slate-950 px-3 py-2 font-bold text-white">
              {page + 1}
            </span>
            <button
              type="button"
              disabled={casePage.totalPages === 0 || page >= casePage.totalPages - 1}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md px-3 py-2 text-slate-600 disabled:text-slate-400"
            >
              ›
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
