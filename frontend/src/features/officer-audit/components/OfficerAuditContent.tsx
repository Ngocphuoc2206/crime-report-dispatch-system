/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { OfficerAuditTable } from "@/features/officer-audit/components/OfficerAuditTable";
import { officerAuditService } from "@/features/officer-audit/services/officerAuditService";
import type {
  ApiPage,
  AuditActionFilter,
  AuditLogItem,
} from "@/features/officer-audit/types/officerAudit.types";

type DateFilter = "today" | "7days" | "30days" | "all";

const PAGE_SIZE = 20;

const emptyPage: ApiPage<AuditLogItem> = {
  content: [],
  number: 0,
  size: PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

function toLocalDateTime(value: Date) {
  const offsetMs = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offsetMs).toISOString().slice(0, 19);
}

function getDateRange(filter: DateFilter) {
  if (filter === "all") return {};

  const from = new Date();
  const to = new Date();

  if (filter === "today") {
    from.setHours(0, 0, 0, 0);
  }

  if (filter === "7days") {
    from.setDate(from.getDate() - 7);
  }

  if (filter === "30days") {
    from.setDate(from.getDate() - 30);
  }

  return {
    from: toLocalDateTime(from),
    to: toLocalDateTime(to),
  };
}

export function OfficerAuditContent() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [actionFilter, setActionFilter] = useState<AuditActionFilter>("ALL");
  const [officerKeyword, setOfficerKeyword] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [page, setPage] = useState(0);
  const [auditPage, setAuditPage] = useState<ApiPage<AuditLogItem>>(emptyPage);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      ...getDateRange(dateFilter),
      action: actionFilter,
      actorKeyword: officerKeyword,
      keyword: globalSearch,
      page,
      size: PAGE_SIZE,
    }),
    [actionFilter, dateFilter, globalSearch, officerKeyword, page],
  );

  const loadAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await officerAuditService.getAuditLogs(query);
      setAuditPage(response);
    } catch (error) {
      setAuditPage(emptyPage);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải nhật ký kiểm toán.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadAuditLogs();
  }, [loadAuditLogs]);

  function handleExportCsv() {
    const header = [
      "Thời gian",
      "Tài khoản",
      "Hành động",
      "Đối tượng",
      "Ghi chú",
      "IP",
    ];

    const rows = auditPage.content.map((item) => [
      item.occurredAt,
      item.accountName,
      item.actionType,
      item.targetCode ?? `${item.resourceType} #${item.resourceId}`,
      item.note,
      item.ipAddress ?? "",
    ]);

    const csvContent = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "nhat-ky-kiem-toan.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  function resetPage() {
    setPage(0);
  }

  return (
    <div className="px-6 py-8">
      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Kiểm toán hệ thống
          </h1>

          <p className="mt-2 text-slate-600">
            Theo dõi nhật ký truy cập và thao tác nghiệp vụ nhằm đảm bảo minh
            bạch, an toàn dữ liệu.
          </p>
        </div>

        <input
          value={globalSearch}
          onChange={(event) => {
            setGlobalSearch(event.target.value);
            resetPage();
          }}
          placeholder="Tìm kiếm nhật ký..."
          className="w-full rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100 lg:w-96"
        />
      </section>

      <section className="mb-8 rounded-xl border border-(--border) bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
          <label className="block flex-1">
            <span className="text-sm font-bold text-slate-700">
              Khoảng thời gian
            </span>

            <select
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.target.value as DateFilter);
                resetPage();
              }}
              className="mt-2 w-full rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="all">Tất cả</option>
            </select>
          </label>

          <label className="block flex-1">
            <span className="text-sm font-bold text-slate-700">
              Loại hành động
            </span>

            <select
              value={actionFilter}
              onChange={(event) => {
                setActionFilter(event.target.value as AuditActionFilter);
                resetPage();
              }}
              className="mt-2 w-full rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả hành động</option>
              <option value="CASE_CREATED">Tạo hồ sơ</option>
              <option value="CASE_ASSIGNED">Phân công</option>
              <option value="CASE_ACCEPTED">Nhận xử lý</option>
              <option value="CASE_LOCKED">Khóa hồ sơ</option>
              <option value="CASE_UNLOCKED">Mở khóa</option>
              <option value="CASE_STATUS_CHANGED">Đổi trạng thái</option>
              <option value="REPORTER_IDENTITY_DECRYPTED">Xem danh tính</option>
              <option value="URGENCY_SCORE_CALCULATED">Chấm điểm</option>
            </select>
          </label>

          <label className="block flex-1">
            <span className="text-sm font-bold text-slate-700">
              Cán bộ thực hiện
            </span>

            <input
              value={officerKeyword}
              onChange={(event) => {
                setOfficerKeyword(event.target.value);
                resetPage();
              }}
              placeholder="Mã user hoặc vai trò"
              className="mt-2 w-full rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />
          </label>

          <button
            type="button"
            onClick={() => void loadAuditLogs()}
            className="rounded-md bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800"
          >
            Lọc dữ liệu
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={auditPage.content.length === 0}
            className="rounded-md border border-(--border) bg-white px-6 py-3 font-bold text-slate-700 hover:bg-red-50 hover:text-(--primary) disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Xuất báo cáo
          </button>
        </div>
      </section>

      {errorMessage ? (
        <section className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-(--primary)">
          {errorMessage}
        </section>
      ) : null}

      {isLoading ? (
        <section className="rounded-xl border border-(--border) bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Đang tải nhật ký kiểm toán...
        </section>
      ) : auditPage.content.length === 0 ? (
        <section className="rounded-xl border border-(--border) bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Không có bản ghi audit phù hợp.
        </section>
      ) : (
        <OfficerAuditTable
          logs={auditPage.content}
          page={auditPage.number}
          pageSize={auditPage.size}
          totalElements={auditPage.totalElements}
          totalPages={auditPage.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
