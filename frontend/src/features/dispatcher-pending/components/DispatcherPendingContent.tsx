"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SpamWarningBadge } from "@/components/ui/SpamWarningBadge";
import {
  DispatcherCaseStatusBadge,
  DispatcherPriorityBadge,
} from "@/features/dispatcher-pending/components/DispatcherPriorityBadge";
import { dispatcherPendingService } from "@/features/dispatcher-pending/services/dispatcherPendingService";
import type {
  PendingDispatchCase,
  PendingDispatchPriority,
} from "@/features/dispatcher-pending/types/dispatcherPending.types";

type PriorityFilter = "ALL" | PendingDispatchPriority;

const PAGE_SIZE = 10;

export function DispatcherPendingContent() {
  const [cases, setCases] = useState<PendingDispatchCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const filteredCases = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return cases.filter((item) => {
      const matchedKeyword =
        keyword === "" ||
        item.caseCode.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword);

      const matchedPriority =
        priorityFilter === "ALL" || item.priority === priorityFilter;

      const matchedType = typeFilter === "ALL" || item.type === typeFilter;

      const matchedDistrict =
        districtFilter === "ALL" || item.district === districtFilter;

      const matchedAvailable =
        !availableOnly || item.suggestedUnit.toLowerCase().includes("sẵn sàng");

      return (
        matchedKeyword &&
        matchedPriority &&
        matchedType &&
        matchedDistrict &&
        matchedAvailable
      );
    });
  }, [cases, searchTerm, priorityFilter, typeFilter, districtFilter, availableOnly]);

  const criticalCount = cases.filter(
    (item) => item.priority === "CRITICAL",
  ).length;

  const totalPages = Math.ceil(filteredCases.length / PAGE_SIZE);
  const pageIndex =
    totalPages === 0 ? 0 : Math.min(currentPage, totalPages - 1);
  const paginatedCases = filteredCases.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE,
  );
  const displayStart = filteredCases.length === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const displayEnd =
    filteredCases.length === 0
      ? 0
      : Math.min(
          pageIndex * PAGE_SIZE + paginatedCases.length,
          filteredCases.length,
        );

  async function loadCases() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await dispatcherPendingService.getPendingCases();
      setCases(data);
    } catch (error) {
      setCases([]);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Khong the tai danh sach cho dieu phoi.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadInitialCases() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await dispatcherPendingService.getPendingCases();

        if (!ignore) {
          setCases(data);
        }
      } catch (error) {
        if (!ignore) {
          setCases([]);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Khong the tai danh sach cho dieu phoi.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadInitialCases();

    return () => {
      ignore = true;
    };
  }, []);

  function handleResetFilter() {
    setSearchTerm("");
    setPriorityFilter("ALL");
    setTypeFilter("ALL");
    setDistrictFilter("ALL");
    setAvailableOnly(false);
    setCurrentPage(0);
  }

  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="page-title">
            Hàng đợi chờ điều phối
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Quản lý và phân công các tin báo mới tiếp nhận. Ưu tiên theo mức độ
            nguy cấp, vị trí và khả năng đáp ứng của đơn vị.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="rounded-lg bg-red-50 px-5 py-3 font-black text-red-900 ring-1 ring-red-200">
            Trạng thái hàng đợi: {criticalCount} khẩn cấp
          </div>

          <button
            type="button"
            onClick={loadCases}
            className="rounded-lg border border-red-200 bg-white px-5 py-3 font-black 
          text-(--primary) hover:bg-red-50"
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>
      </section>

      {errorMessage ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-(--primary)">
          {errorMessage}
        </section>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-red-50/70 p-5">
          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr_auto_auto]">
            <label>
              <span className="text-sm font-bold text-slate-600">
                Tìm kiếm mã tin / vị trí
              </span>

              <input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(0);
                }}
                placeholder="VD: INC-8492, Nguyễn Trãi..."
                className="mt-2 w-full rounded-lg border border-red-200 bg-white px-4 py-3 outline-none 
                focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label>
              <span className="text-sm font-bold text-slate-600">Mức độ</span>

              <select
                value={priorityFilter}
                onChange={(event) => {
                  setPriorityFilter(event.target.value as PriorityFilter);
                  setCurrentPage(0);
                }}
                className="mt-2 w-full rounded-lg border border-red-200 bg-white px-4 py-3 outline-none 
                focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              >
                <option value="ALL">Tất cả</option>
                <option value="CRITICAL">Khẩn cấp</option>
                <option value="HIGH">Cao</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="LOW">Thông thường</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-bold text-slate-600">
                Loại vụ việc
              </span>

              <select
                value={typeFilter}
                onChange={(event) => {
                  setTypeFilter(event.target.value);
                  setCurrentPage(0);
                }}
                className="mt-2 w-full rounded-lg border border-red-200 bg-white px-4 py-3 outline-none 
                focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              >
                <option value="ALL">Tất cả</option>
                <option value="Cướp tài sản">Cướp tài sản</option>
                <option value="Tai nạn giao thông">Tai nạn giao thông</option>
                <option value="Gây rối trật tự">Gây rối trật tự</option>
                <option value="Mâu thuẫn gia đình">Mâu thuẫn gia đình</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-bold text-slate-600">Khu vực</span>

              <select
                value={districtFilter}
                onChange={(event) => {
                  setDistrictFilter(event.target.value);
                  setCurrentPage(0);
                }}
                className="mt-2 w-full rounded-lg border border-red-200 bg-white px-4 py-3 outline-none 
                focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              >
                <option value="ALL">Tất cả khu vực</option>
                <option value="Quận 1">Quận 1</option>
                <option value="Quận 3">Quận 3</option>
                <option value="Quận 7">Quận 7</option>
                <option value="Quận Hoàn Kiếm">Quận Hoàn Kiếm</option>
              </select>
            </label>

            <label className="flex items-end gap-3 pb-3">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => {
                  setAvailableOnly(event.target.checked);
                  setCurrentPage(0);
                }}
                className="size-5 accent-(--primary)"
              />

              <span className="text-sm font-bold text-slate-700">
                Chỉ hiện đơn vị sẵn sàng
              </span>
            </label>

            <button
              type="button"
              onClick={handleResetFilter}
              className="self-end rounded-lg border border-red-200 px-4 py-3 font-black text-slate-700 hover:bg-white"
            >
              Đặt lại
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-300 text-left text-sm">
            <thead className="bg-red-50 text-xs uppercase tracking-wide text-red-950/70">
              <tr>
                <th className="px-5 py-4">Mã tin</th>
                <th className="px-5 py-4">Mức độ</th>
                <th className="px-5 py-4">Loại vụ việc</th>
                <th className="px-5 py-4">Vị trí</th>
                <th className="px-5 py-4">Khoảng cách</th>
                <th className="px-5 py-4">Chờ</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Đơn vị gợi ý</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-red-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-10 text-center text-sm font-semibold text-slate-500"
                  >
                    Đang tải danh sách chờ điều phối...
                  </td>
                </tr>
              ) : null}

              {!loading && filteredCases.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-10 text-center text-sm font-semibold text-slate-500"
                  >
                    Hiện chưa có tin báo nào đang chờ điều phối.
                  </td>
                </tr>
              ) : null}

              {paginatedCases.map((item) => (
                <tr key={item.id} className="hover:bg-red-50/50">
                  <td className="px-5 py-5 font-black text-red-900">
                    #{item.caseCode}
                  </td>

                  <td className="px-5 py-5">
                    <DispatcherPriorityBadge priority={item.priority} />
                  </td>

                  <td className="px-5 py-5 font-semibold text-slate-800">
                    <div>{item.type}</div>
                    <div className="mt-2">
                      <SpamWarningBadge
                        level={item.spamLevel}
                        score={item.spamScore}
                        reasons={item.spamReasons}
                      />
                    </div>
                  </td>

                  <td className="max-w-xs px-5 py-5 text-slate-700">
                    {item.location}
                  </td>

                  <td className="px-5 py-5 font-black text-(--primary)">
                    {item.distanceToUnit}
                  </td>

                  <td className="px-5 py-5 font-black text-orange-600">
                    {item.waitTime}
                  </td>

                  <td className="px-5 py-5">
                    <DispatcherCaseStatusBadge status={item.status} />
                  </td>

                  <td className="px-5 py-5 text-slate-700">
                    {item.suggestedUnit}
                  </td>

                  <td className="px-5 py-5 text-right">
                    <Link
                      href={`/dispatcher/pending/${encodeURIComponent(
                        item.caseCode,
                      )}`}
                      className="rounded-lg bg-(--primary) px-4 py-2 font-black text-white hover:bg-[var(--primary-hover)]"
                    >
                      Điều phối
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-red-100 bg-red-50/60 px-5 py-4 text-sm text-slate-600">
          <p>
            Hiển thị {displayStart}-{displayEnd} trong tổng số{" "}
            {cases.length} tin chờ điều phối
          </p>

          {totalPages > 0 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pageIndex <= 0}
                onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                className="rounded-md px-3 py-2 text-slate-600 disabled:text-slate-400"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index)}
                  className={[
                    "rounded-md px-3 py-2 font-black",
                    index === pageIndex
                      ? "bg-(--primary) text-white"
                      : "text-slate-600 hover:bg-white",
                  ].join(" ")}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={pageIndex >= totalPages - 1}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages - 1, page + 1))
                }
                className="rounded-md px-3 py-2 text-slate-600 disabled:text-slate-400"
              >
                ›
              </button>
            </div>
          ) : null}
        </footer>
      </section>
    </div>
  );
}
