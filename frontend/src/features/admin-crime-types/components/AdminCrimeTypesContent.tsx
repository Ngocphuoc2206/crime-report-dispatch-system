"use client";

import { useMemo, useState } from "react";
import { AdminCreateCrimeTypeModal } from "@/features/admin-crime-types/components/AdminCreateCrimeTypeModal";
import { AdminCrimeTypeStatusBadge } from "@/features/admin-crime-types/components/AdminCrimeTypeBadges";
import { adminCrimeTypes as initialCrimeTypes } from "@/features/admin-crime-types/data/adminCrimeTypes.data";
import type {
  AdminCrimeType,
  AdminCrimeTypeStatus,
} from "@/features/admin-crime-types/types/adminCrimeType.types";

type StatusFilter = "ALL" | AdminCrimeTypeStatus;

export function AdminCrimeTypesContent() {
  const [crimeTypes, setCrimeTypes] =
    useState<AdminCrimeType[]>(initialCrimeTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredCrimeTypes = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return crimeTypes.filter((item) => {
      const matchedKeyword =
        keyword === "" ||
        item.code.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      const matchedStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchedKeyword && matchedStatus;
    });
  }, [crimeTypes, searchTerm, statusFilter]);

  function handleCreateCrimeType(crimeType: AdminCrimeType) {
    setCrimeTypes((current) => [crimeType, ...current]);
    setCreateModalOpen(false);
    setToast("Tạo loại tội phạm thành công");

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  function handleReset() {
    setSearchTerm("");
    setStatusFilter("ALL");
  }

  const nextId =
    crimeTypes.length === 0
      ? 1
      : Math.max(...crimeTypes.map((item) => item.id)) + 1;

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          ✓ {toast}
        </div>
      ) : null}

      <AdminCreateCrimeTypeModal
        open={createModalOpen}
        nextId={nextId}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateCrimeType}
      />

      <section>
        <h1 className="text-4xl font-black text-slate-950">
          Quản lý loại tội phạm
        </h1>

        <p className="mt-3 text-slate-600">
          Quản lý danh mục loại vụ việc và điểm nguy cấp cơ sở.
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_auto_auto]">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm loại tội phạm..."
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Ngừng hoạt động</option>
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg px-5 py-3 font-black text-slate-600 hover:bg-slate-100"
          >
            Đặt lại
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
          >
            + Tạo loại tội phạm
          </button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Mã loại</th>
                <th className="px-5 py-4">Tên loại tội phạm</th>
                <th className="px-5 py-4">Mô tả</th>
                <th className="px-5 py-4">Category ID</th>
                <th className="px-5 py-4">Điểm cơ sở</th>
                <th className="px-5 py-4">Trạng thái</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredCrimeTypes.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700">{item.id}</td>

                  <td className="px-5 py-5 font-black text-slate-800">
                    {item.code}
                  </td>

                  <td className="px-5 py-5 font-black text-slate-950">
                    {item.name}
                  </td>

                  <td className="max-w-sm px-5 py-5 leading-6 text-slate-600">
                    {item.description}
                  </td>

                  <td className="px-5 py-5">
                    <span className="rounded-md bg-slate-100 px-3 py-1 font-bold text-slate-700">
                      {item.categoryId}
                    </span>
                  </td>

                  <td className="px-5 py-5 font-black text-[var(--primary)]">
                    {item.baseScore}
                  </td>

                  <td className="px-5 py-5">
                    <AdminCrimeTypeStatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
          <p>
            Hiển thị 1-{filteredCrimeTypes.length} của {crimeTypes.length} bản
            ghi
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-md px-3 py-2 text-slate-400">‹</button>
            <button className="rounded-md bg-[var(--primary)] px-3 py-2 font-black text-white">
              1
            </button>
            <button className="rounded-md px-3 py-2 font-black text-slate-600">
              2
            </button>
            <button className="rounded-md px-3 py-2 font-black text-slate-600">
              3
            </button>
            <span className="px-2 text-slate-400">...</span>
            <button className="rounded-md px-3 py-2 text-slate-600">›</button>
          </div>
        </footer>
      </section>
    </div>
  );
}
