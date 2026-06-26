"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminCreateOfficerModal } from "@/features/admin-officers/components/AdminCreateOfficerModal";
import { AdminOfficerStatusBadge } from "@/features/admin-officers/components/AdminOfficerBadges";
import { adminOfficerProfiles } from "@/features/admin-officers/data/adminOfficers.data";
import type {
  AdminOfficerProfile,
  AdminOfficerRank,
} from "@/features/admin-officers/types/adminOfficer.types";

type RankFilter = "ALL" | AdminOfficerRank;

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function AdminOfficersContent() {
  const [officers, setOfficers] =
    useState<AdminOfficerProfile[]>(adminOfficerProfiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [rankFilter, setRankFilter] = useState<RankFilter>("ALL");
  const [unitFilter, setUnitFilter] = useState("ALL");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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

  function handleReset() {
    setSearchTerm("");
    setRankFilter("ALL");
    setUnitFilter("ALL");
  }

  function handleCreateOfficer(officer: AdminOfficerProfile) {
    setOfficers((current) => [officer, ...current]);
    setCreateModalOpen(false);
    setToast("Tạo hồ sơ cán bộ thành công");

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          ✓ {toast}
        </div>
      ) : null}

      <AdminCreateOfficerModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateOfficer}
      />

      <section>
        <h1 className="text-4xl font-black text-slate-950">
          Quản lý hồ sơ cán bộ
        </h1>

        <p className="mt-3 text-slate-600">
          Theo dõi và quản lý thông tin nghiệp vụ chi tiết của các cán bộ
          Officer trong hệ thống.
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr_0.9fr_auto_auto]">
          <label>
            <span className="text-sm font-semibold text-slate-600">
              Tìm kiếm cán bộ
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nhập Officer ID, họ tên hoặc số hiệu"
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-600">
              Cấp bậc
            </span>
            <select
              value={rankFilter}
              onChange={(event) =>
                setRankFilter(event.target.value as RankFilter)
              }
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả cấp bậc</option>
              <option value="Trung úy">Trung úy</option>
              <option value="Thượng úy">Thượng úy</option>
              <option value="Đại úy">Đại úy</option>
              <option value="Điều tra viên cao cấp">
                Điều tra viên cao cấp
              </option>
            </select>
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-600">
              Mã đơn vị Unit ID
            </span>
            <select
              value={unitFilter}
              onChange={(event) => setUnitFilter(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả đơn vị</option>
              <option value="UNIT-Q1">UNIT-Q1</option>
              <option value="UNIT-Q3">UNIT-Q3</option>
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
            className="self-end rounded-lg bg-(--primary) px-5 py-3 font-black text-white hover:bg-(--primary-hover)"
          >
            Lọc dữ liệu
          </button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Danh sách cán bộ
          </h2>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-lg bg-blue-100 px-5 py-3 font-black text-(--primary) hover:bg-blue-200"
          >
            + Thêm mới
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Officer ID</th>
                <th className="px-5 py-4">Họ và tên</th>
                <th className="px-5 py-4">Số hiệu / Cấp bậc</th>
                <th className="px-5 py-4">Đơn vị</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700">{officer.userId}</td>

                  <td className="px-5 py-5">
                    <Link
                      href={`/admin/officers/${encodeURIComponent(
                        officer.officerId,
                      )}`}
                      className="font-black text-(--primary) hover:underline"
                    >
                      {officer.officerId}
                    </Link>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-10 items-center justify-center rounded-full 
                      bg-slate-100 font-black text-(--primary)"
                      >
                        {getInitials(officer.fullName)}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {officer.fullName}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <p className="font-semibold text-slate-900">
                      {officer.badgeNumber}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {officer.rank}
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    <p className="font-semibold text-slate-800">
                      {officer.unitId}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {officer.unitName}
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    <AdminOfficerStatusBadge status={officer.status} />
                  </td>

                  <td className="px-5 py-5 text-right">
                    <Link
                      href={`/admin/officers/${encodeURIComponent(
                        officer.officerId,
                      )}`}
                      className="rounded-lg border border-slate-200 px-4 py-2 font-bold 
                      text-slate-700 hover:bg-slate-50"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
          <p>Hiển thị 1 - {filteredOfficers.length} trong số 45 bản ghi</p>

          <div className="flex items-center gap-2">
            <button className="rounded-md px-3 py-2 text-slate-400">‹</button>
            <button className="rounded-md bg-(--primary) px-3 py-2 font-black text-white">
              1
            </button>
            <button className="rounded-md px-3 py-2 font-black text-slate-600">
              2
            </button>
            <button className="rounded-md px-3 py-2 font-black text-slate-600">
              3
            </button>
            <button className="rounded-md px-3 py-2 text-slate-600">›</button>
          </div>
        </footer>
      </section>
    </div>
  );
}
