"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DispatcherOfficerStatusBadge } from "@/features/dispatcher-officers/components/DispatcherOfficerBadges";
import { DispatcherOfficerFiltersDrawer } from "@/features/dispatcher-officers/components/DispatcherOfficerFiltersDrawer";
import { dispatcherOfficerService } from "@/features/dispatcher-officers/services/dispatcherOfficerService";
import type {
  DispatcherOfficer,
  DispatcherOfficerAdvancedFilters,
} from "@/features/dispatcher-officers/types/dispatcherOfficers.types";

type QuickFilter = "ALL" | "AVAILABLE_ONLY";

const PAGE_SIZE = 10;

const defaultAdvancedFilters: DispatcherOfficerAdvancedFilters = {
  status: "ALL",
  shift: "ALL",
  workload: "ALL",
};

function getStatusFilterLabel(
  status: DispatcherOfficerAdvancedFilters["status"],
) {
  switch (status) {
    case "AVAILABLE":
      return "Sẵn sàng";
    case "BUSY":
      return "Đang bận";
    case "ON_SCENE":
      return "Tại hiện trường";
    case "OFF_DUTY":
      return "Hết ca";
    default:
      return "Tất cả";
  }
}

function getShiftFilterLabel(shift: DispatcherOfficerAdvancedFilters["shift"]) {
  switch (shift) {
    case "MORNING":
      return "Ca sáng";
    case "AFTERNOON":
      return "Ca chiều";
    case "NIGHT":
      return "Ca đêm";
    default:
      return "Tất cả";
  }
}

function getWorkloadFilterLabel(
  workload: DispatcherOfficerAdvancedFilters["workload"],
) {
  switch (workload) {
    case "ZERO":
      return "0 hồ sơ";
    case "ONE":
      return "1 hồ sơ";
    case "MULTIPLE":
      return "Từ 2 hồ sơ trở lên";
    default:
      return "Tất cả";
  }
}

export function DispatcherOfficersContent() {
  const [officers, setOfficers] = useState<DispatcherOfficer[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] =
    useState<DispatcherOfficerAdvancedFilters>(defaultAdvancedFilters);

  const filteredOfficers = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return officers.filter((officer) => {
      const matchKeyword =
        q === "" ||
        officer.fullName.toLowerCase().includes(q) ||
        officer.unitCode.toLowerCase().includes(q) ||
        officer.badgeNumber.toLowerCase().includes(q) ||
        officer.phone.toLowerCase().includes(q) ||
        (officer.currentCaseCode || "").toLowerCase().includes(q);

      const matchQuickFilter =
        quickFilter === "ALL" ||
        (quickFilter === "AVAILABLE_ONLY" && officer.status === "AVAILABLE");

      const matchStatus =
        advancedFilters.status === "ALL" ||
        officer.status === advancedFilters.status;

      const matchShift =
        advancedFilters.shift === "ALL" ||
        officer.shiftType === advancedFilters.shift;

      const matchWorkload =
        advancedFilters.workload === "ALL" ||
        (advancedFilters.workload === "ZERO" && officer.activeCases === 0) ||
        (advancedFilters.workload === "ONE" && officer.activeCases === 1) ||
        (advancedFilters.workload === "MULTIPLE" && officer.activeCases >= 2);

      return (
        matchKeyword &&
        matchQuickFilter &&
        matchStatus &&
        matchShift &&
        matchWorkload
      );
    });
  }, [officers, keyword, quickFilter, advancedFilters]);

  const hasAdvancedFilter =
    advancedFilters.status !== "ALL" ||
    advancedFilters.shift !== "ALL" ||
    advancedFilters.workload !== "ALL";

  const localStats = useMemo(() => {
    const available = officers.filter((o) => o.status === "AVAILABLE").length;
    const busyOrOnScene = officers.filter(
      (o) => o.status === "BUSY" || o.status === "ON_SCENE",
    ).length;
    const offDuty = officers.filter((o) => o.status === "OFF_DUTY").length;

    return {
      total: officers.length,
      available,
      busyOrOnScene,
      offDuty,
    };
  }, [officers]);

  function renderAvatar(officer: DispatcherOfficer) {
    if (officer.avatar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={officer.avatar}
          alt={officer.fullName}
          className="h-11 w-11 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 font-black text-red-700">
        {officer.initials}
      </div>
    );
  }

  const stats = localStats;

  const totalPages = Math.ceil(filteredOfficers.length / PAGE_SIZE);
  const pageIndex =
    totalPages === 0 ? 0 : Math.min(currentPage, totalPages - 1);
  const paginatedOfficers = filteredOfficers.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE,
  );
  const displayStart =
    filteredOfficers.length === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const displayEnd =
    filteredOfficers.length === 0
      ? 0
      : Math.min(
          pageIndex * PAGE_SIZE + paginatedOfficers.length,
          filteredOfficers.length,
        );

  async function loadOfficers() {
    setLoading(true);

    try {
      const data = await dispatcherOfficerService.getAvailability();

      setOfficers(data);
    } catch {
      setOfficers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadInitialOfficers() {
      try {
        const data = await dispatcherOfficerService.getAvailability();

        if (!ignore) {
          setOfficers(data);
        }
      } catch {
        if (!ignore) {
          setOfficers([]);
        }
      }
    }

    void loadInitialOfficers();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="relative px-8 py-8">
      <DispatcherOfficerFiltersDrawer
        open={drawerOpen}
        filters={advancedFilters}
        onClose={() => setDrawerOpen(false)}
        onApply={(nextFilters) => {
          setAdvancedFilters(nextFilters);
          setCurrentPage(0);
        }}
        onReset={() => {
          setAdvancedFilters(defaultAdvancedFilters);
          setQuickFilter("ALL");
          setCurrentPage(0);
        }}
      />

      <section className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="page-title">
            Tình trạng cán bộ
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Theo dõi trạng thái trực chiến và mức độ sẵn sàng điều phối của cán
            bộ theo thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setQuickFilter("ALL");
              setCurrentPage(0);
            }}
            className={[
              "rounded-lg px-5 py-3 font-black",
              quickFilter === "ALL"
                ? "bg-(--primary) text-white"
                : "border border-red-200 bg-white text-slate-700",
            ].join(" ")}
          >
            Tất cả cán bộ
          </button>

          <button
            type="button"
            onClick={() => {
              setQuickFilter("AVAILABLE_ONLY");
              setCurrentPage(0);
            }}
            className={[
              "rounded-lg px-5 py-3 font-black",
              quickFilter === "AVAILABLE_ONLY"
                ? "bg-(--primary) text-white"
                : "border border-red-200 bg-white text-slate-700",
            ].join(" ")}
          >
            Chỉ hiển thị sẵn sàng
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={[
              "rounded-lg px-5 py-3 font-black",
              hasAdvancedFilter
                ? "bg-red-50 text-[var(--primary)] ring-2 ring-red-200"
                : "border border-red-200 bg-white text-slate-700 hover:bg-red-50",
            ].join(" ")}
          >
            Bộ lọc nâng cao
            {hasAdvancedFilter ? " • Đang áp dụng" : ""}
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-bold text-red-900/70">Tổng cán bộ</p>
          <p className="mt-2 text-4xl font-black text-red-950">{stats.total}</p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm font-bold text-green-900/70">Sẵn sàng</p>
          <p className="mt-2 text-4xl font-black text-green-700">
            {stats.available}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-bold text-amber-900/70">
            Đang bận / hiện trường
          </p>
          <p className="mt-2 text-4xl font-black text-amber-700">
            {stats.busyOrOnScene}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-600">Hết ca</p>
          <p className="mt-2 text-4xl font-black text-slate-700">
            {stats.offDuty}
          </p>
        </div>
      </section>

      {hasAdvancedFilter ? (
        <section className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <span className="font-black text-red-900">Bộ lọc đang áp dụng:</span>

          {advancedFilters.status !== "ALL" ? (
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-700 ring-1 ring-red-200">
              Trạng thái: {getStatusFilterLabel(advancedFilters.status)}
            </span>
          ) : null}

          {advancedFilters.shift !== "ALL" ? (
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-700 ring-1 ring-red-200">
              Ca trực: {getShiftFilterLabel(advancedFilters.shift)}
            </span>
          ) : null}

          {advancedFilters.workload !== "ALL" ? (
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-700 ring-1 ring-red-200">
              Tải xử lý: {getWorkloadFilterLabel(advancedFilters.workload)}
            </span>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setAdvancedFilters(defaultAdvancedFilters);
              setQuickFilter("ALL");
              setCurrentPage(0);
            }}
            className="ml-auto rounded-lg border border-red-200 bg-white px-4 py-2 font-black text-[var(--primary)] hover:bg-red-50"
          >
            Xóa bộ lọc
          </button>
        </section>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-red-100 bg-red-50 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-red-950">
              Danh sách cán bộ trực
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Theo dõi lực lượng đang trực và trạng thái sẵn sàng tiếp nhận điều
              phối.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setCurrentPage(0);
              }}
              placeholder="Tìm theo tên, số hiệu, đơn vị, hồ sơ..."
              className="w-full min-w-[320px] rounded-lg border border-red-200 px-4 py-3 outline-none 
              focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />

            <button
              type="button"
              onClick={loadOfficers}
              className="rounded-lg border border-red-200 bg-white px-4 py-3 font-black text-slate-700"
            >
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-300 text-left text-sm">
            <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Cán bộ</th>
                <th className="px-5 py-4">Đơn vị / số hiệu</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Hồ sơ hiện tại</th>
                <th className="px-5 py-4">Số hồ sơ</th>
                <th className="px-5 py-4">Vị trí gần nhất</th>
                <th className="px-5 py-4">Ca trực</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-red-100">
              {paginatedOfficers.map((officer) => {
                const canDispatch = officer.status === "AVAILABLE";

                return (
                  <tr key={officer.id} className="hover:bg-red-50/40">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        {renderAvatar(officer)}
                        <div>
                          <p className="font-black text-slate-950">
                            {officer.fullName}
                          </p>
                          <p className="text-sm text-slate-500">
                            {officer.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-semibold text-slate-900">
                        {officer.unitCode}
                      </p>
                      <p className="text-sm text-slate-500">
                        {officer.badgeNumber}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <DispatcherOfficerStatusBadge status={officer.status} />
                    </td>

                    <td className="px-5 py-5">
                      {officer.currentCaseCode ? (
                        <Link
                          href={`/dispatcher/assigned/${encodeURIComponent(
                            officer.currentCaseCode,
                          )}`}
                          className="font-black text-blue-700 hover:underline"
                        >
                          {officer.currentCaseCode}
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-5 font-black text-slate-700">
                      {officer.activeCases}
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-medium text-slate-900">
                        {officer.lastLocation}
                      </p>
                      <p className="text-sm text-slate-500">
                        {officer.lastUpdated}
                      </p>
                    </td>

                    <td className="px-5 py-5 font-medium text-slate-700">
                      {officer.shiftTime}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-red-200 px-3 py-2 font-bold text-slate-700 hover:bg-red-50"
                        >
                          Xem chi tiết
                        </button>

                        <button
                          type="button"
                          disabled={!canDispatch}
                          className="rounded-lg bg-(--primary) px-3 py-2 font-bold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Điều phối
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="mx-auto max-w-md">
                      <p className="text-xl font-black text-slate-800">
                        Không tìm thấy cán bộ phù hợp
                      </p>
                      <p className="mt-2 text-slate-500">
                        Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc hiện tại.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-red-100 bg-red-50/60 px-5 py-4 text-sm text-slate-600">
          <p>
            Hiển thị {displayStart}-{displayEnd} trong tổng số {officers.length}{" "}
            cán bộ
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
