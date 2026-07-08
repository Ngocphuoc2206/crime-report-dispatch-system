"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminCreateOfficerModal } from "@/features/admin-officers/components/AdminCreateOfficerModal";
import { AdminOfficerStatusBadge } from "@/features/admin-officers/components/AdminOfficerBadges";
import { adminOfficerService } from "@/features/admin-officers/services/adminOfficerService";
import type {
  AdminOfficerProfile,
  AdminOfficerRank,
} from "@/features/admin-officers/types/adminOfficer.types";

type RankFilter = "ALL" | AdminOfficerRank;

const pageSize = 10;

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function AdminOfficersContent() {
  const [officers, setOfficers] = useState<AdminOfficerProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rankFilter, setRankFilter] = useState<RankFilter>("ALL");
  const [unitFilter, setUnitFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadOfficers() {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await adminOfficerService.getAll();
      setOfficers(response);
    } catch {
      setOfficers([]);
      setApiError(
        "Không kết nối được backend quản lý cán bộ.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOfficers();
  }, []);

  const filteredOfficers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return officers.filter((officer) => {
      const matchedKeyword =
        keyword === "" ||
        officer.userId.toLowerCase().includes(keyword) ||
        officer.officerId.toLowerCase().includes(keyword) ||
        officer.fullName.toLowerCase().includes(keyword) ||
        officer.badgeNumber.toLowerCase().includes(keyword);

      const matchedRank = rankFilter === "ALL" || officer.rank === rankFilter;
      const matchedUnit = unitFilter === "ALL" || officer.unitId === unitFilter;

      return matchedKeyword && matchedRank && matchedUnit;
    });
  }, [officers, searchTerm, rankFilter, unitFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOfficers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedOfficers = filteredOfficers.slice(pageStart, pageStart + pageSize);
  const visibleStart = filteredOfficers.length === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(
    pageStart + pagedOfficers.length,
    filteredOfficers.length,
  );

  function handleReset() {
    setSearchTerm("");
    setRankFilter("ALL");
    setUnitFilter("ALL");
    setPage(1);
  }

  function handleCreateOfficer(officer: AdminOfficerProfile) {
    void adminOfficerService
      .create(officer)
      .then((createdOfficer) => {
        setOfficers((current) => [createdOfficer, ...current]);
        setPage(1);
        setCreateModalOpen(false);
        setToast("Tạo hồ sơ cán bộ thành công");
        window.setTimeout(() => setToast(null), 2200);
      })
      .catch((createError) => {
        setApiError(
          createError instanceof Error
            ? createError.message
            : "Không tạo được hồ sơ cán bộ.",
        );
      });
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          {toast}
        </div>
      ) : null}

      <AdminCreateOfficerModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateOfficer}
      />

      <section>
        <h1 className="page-title">
          Quản lý hồ sơ cán bộ
        </h1>

        <p className="mt-3 text-slate-600">
          Theo dõi và quản lý thông tin nghiệp vụ chi tiết của các cán bộ
          Officer trong hệ thống.
        </p>
      </section>

      {apiError ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-[var(--primary)]">
          {apiError}
        </section>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr_0.9fr_auto_auto]">
          <label>
            <span className="text-sm font-semibold text-slate-600">
              Tìm kiếm cán bộ
            </span>
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Nhập Officer ID, họ tên hoặc số hiệu"
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-600">
              Cấp bậc
            </span>
            <select
              value={rankFilter}
              onChange={(event) => {
                setRankFilter(event.target.value as RankFilter);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả cấp bậc</option>
              {[...new Set(officers.map((officer) => officer.rank))].map(
                (rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-600">
              Đơn vị
            </span>
            <select
              value={unitFilter}
              onChange={(event) => {
                setUnitFilter(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả đơn vị</option>
              {[...new Set(officers.map((officer) => officer.unitId))].map(
                (unitId) => (
                  <option key={unitId} value={unitId}>
                    {unitId}
                  </option>
                ),
              )}
            </select>
          </label>

          <button
            type="button"
            onClick={handleReset}
            className="self-end rounded-lg px-5 py-3 font-black text-slate-600 hover:bg-slate-100"
          >
            Đặt lại
          </button>

          <button
            type="button"
            onClick={() => void loadOfficers()}
            className="self-end rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
          >
            Tải lại
          </button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="section-title">
            Danh sách cán bộ
          </h2>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-lg bg-blue-100 px-5 py-3 font-black text-[var(--primary)] hover:bg-blue-200"
          >
            + Thêm mới
          </button>
        </header>

        {isLoading ? (
          <div className="p-8 text-center font-semibold text-slate-600">
            Đang tải danh sách cán bộ...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Officer ID</th>
                  <th className="px-6 py-4">Họ và tên</th>
                  <th className="px-6 py-4">Số hiệu / Cấp bậc</th>
                  <th className="px-6 py-4">Đơn vị</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {pagedOfficers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-700">
                      {officer.userId}
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/officers/${encodeURIComponent(
                          officer.officerId,
                        )}`}
                        className="font-black text-[var(--primary)] hover:underline"
                      >
                        {officer.officerId}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 font-black text-[var(--primary)]">
                          {getInitials(officer.fullName)}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {officer.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {officer.badgeNumber}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {officer.rank}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {officer.unitId}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {officer.unitName}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <AdminOfficerStatusBadge status={officer.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/officers/${encodeURIComponent(
                          officer.officerId,
                        )}`}
                        className="rounded-lg border border-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>Hiển thị {visibleStart}-{visibleEnd} trong số {filteredOfficers.length} hồ sơ</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-md px-3 py-2 font-black text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              &lt;
            </button>

            <span className="rounded-md bg-[var(--primary)] px-3 py-2 font-black text-white">
              {currentPage}
            </span>

            <span className="px-2 text-slate-500">/ {totalPages}</span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="rounded-md px-3 py-2 font-black text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              &gt;
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
