"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminCreateOfficerModal } from "@/features/admin-officers/components/AdminCreateOfficerModal";
import { AdminOfficerStatusBadge } from "@/features/admin-officers/components/AdminOfficerBadges";
import { adminOfficerProfiles } from "@/features/admin-officers/data/adminOfficers.data";
import { adminOfficerService } from "@/features/admin-officers/services/adminOfficerService";
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
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadOfficers() {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await adminOfficerService.getAll();
      setOfficers(response);
    } catch {
      setOfficers(adminOfficerProfiles);
      setApiError(
        "Khong ket noi duoc backend admin officers. Dang hien thi du lieu mau.",
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

  function handleReset() {
    setSearchTerm("");
    setRankFilter("ALL");
    setUnitFilter("ALL");
  }

  function handleCreateOfficer(officer: AdminOfficerProfile) {
    void adminOfficerService
      .create(officer)
      .then((createdOfficer) => {
        setOfficers((current) => [createdOfficer, ...current]);
        setCreateModalOpen(false);
        setToast("Tao ho so can bo thanh cong");
        window.setTimeout(() => setToast(null), 2200);
      })
      .catch((createError) => {
        setApiError(
          createError instanceof Error
            ? createError.message
            : "Khong tao duoc ho so can bo.",
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
        <h1 className="text-4xl font-black text-slate-950">
          Quan ly ho so can bo
        </h1>

        <p className="mt-3 text-slate-600">
          Theo doi va quan ly thong tin nghiep vu chi tiet cua cac can bo
          Officer trong he thong.
        </p>
      </section>

      {apiError ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-[var(--primary)]">
          {apiError}
        </section>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr_0.9fr_auto_auto]">
          <label>
            <span className="text-sm font-semibold text-slate-600">
              Tim kiem can bo
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nhap Officer ID, ho ten hoac so hieu"
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-600">
              Cap bac
            </span>
            <select
              value={rankFilter}
              onChange={(event) =>
                setRankFilter(event.target.value as RankFilter)
              }
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tat ca cap bac</option>
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
              Unit ID
            </span>
            <select
              value={unitFilter}
              onChange={(event) => setUnitFilter(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tat ca don vi</option>
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
            Dat lai
          </button>

          <button
            type="button"
            onClick={() => void loadOfficers()}
            className="self-end rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
          >
            Tai lai
          </button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Danh sach can bo
          </h2>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-lg bg-blue-100 px-5 py-3 font-black text-[var(--primary)] hover:bg-blue-200"
          >
            + Them moi
          </button>
        </header>

        {isLoading ? (
          <div className="p-8 text-center font-semibold text-slate-600">
            Dang tai danh sach can bo...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Officer ID</th>
                  <th className="px-5 py-4">Ho va ten</th>
                  <th className="px-5 py-4">So hieu / Cap bac</th>
                  <th className="px-5 py-4">Don vi</th>
                  <th className="px-5 py-4">Trang thai</th>
                  <th className="px-5 py-4 text-right">Thao tac</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredOfficers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-slate-50">
                    <td className="px-5 py-5 text-slate-700">
                      {officer.userId}
                    </td>

                    <td className="px-5 py-5">
                      <Link
                        href={`/admin/officers/${encodeURIComponent(
                          officer.officerId,
                        )}`}
                        className="font-black text-[var(--primary)] hover:underline"
                      >
                        {officer.officerId}
                      </Link>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 font-black text-[var(--primary)]">
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
                        className="rounded-lg border border-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Chi tiet
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
          <p>
            Hien thi {filteredOfficers.length} trong so {officers.length} ban
            ghi
          </p>
        </footer>
      </section>
    </div>
  );
}
