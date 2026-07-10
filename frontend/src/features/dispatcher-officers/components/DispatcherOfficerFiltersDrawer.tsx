"use client";

import { useEffect, useState } from "react";
import type {
  DispatcherOfficerAdvancedFilters,
  OfficerShiftFilter,
  OfficerStatusFilter,
  OfficerWorkloadFilter,
} from "@/features/dispatcher-officers/types/dispatcherOfficers.types";

type DispatcherOfficerFiltersDrawerProps = {
  open: boolean;
  filters: DispatcherOfficerAdvancedFilters;
  onClose: () => void;
  onApply: (filters: DispatcherOfficerAdvancedFilters) => void;
  onReset: () => void;
};

const defaultFilters: DispatcherOfficerAdvancedFilters = {
  status: "ALL",
  shift: "ALL",
  workload: "ALL",
};

export function DispatcherOfficerFiltersDrawer({
  open,
  filters,
  onClose,
  onApply,
  onReset,
}: DispatcherOfficerFiltersDrawerProps) {
  const [localFilters, setLocalFilters] =
    useState<DispatcherOfficerAdvancedFilters>(filters);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalFilters(filters);
    }
  }, [open, filters]);

  if (!open) return null;

  function handleReset() {
    setLocalFilters(defaultFilters);
    onReset();
  }

  function handleApply() {
    onApply(localFilters);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />

      <aside className="w-full max-w-md bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-red-100 px-6 py-5">
          <div>
            <h2 className="section-title">
              Bộ lọc nâng cao
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lọc cán bộ theo trạng thái, ca trực và tải xử lý.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-6">
          <label className="block">
            <span className="text-sm font-black text-slate-700">
              Trạng thái cán bộ
            </span>

            <select
              value={localFilters.status}
              onChange={(event) =>
                setLocalFilters((current) => ({
                  ...current,
                  status: event.target.value as OfficerStatusFilter,
                }))
              }
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none 
              focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="AVAILABLE">Sẵn sàng</option>
              <option value="BUSY">Đang bận</option>
              <option value="ON_SCENE">Tại hiện trường</option>
              <option value="OFF_DUTY">Hết ca</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-700">Ca trực</span>

            <select
              value={localFilters.shift}
              onChange={(event) =>
                setLocalFilters((current) => ({
                  ...current,
                  shift: event.target.value as OfficerShiftFilter,
                }))
              }
              className="mt-2 w-full rounded-lg border 
              border-red-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả ca</option>
              <option value="MORNING">Ca sáng</option>
              <option value="AFTERNOON">Ca chiều</option>
              <option value="NIGHT">Ca đêm</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-700">
              Số hồ sơ đang xử lý
            </span>

            <select
              value={localFilters.workload}
              onChange={(event) =>
                setLocalFilters((current) => ({
                  ...current,
                  workload: event.target.value as OfficerWorkloadFilter,
                }))
              }
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none 
              focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả</option>
              <option value="ZERO">0 hồ sơ</option>
              <option value="ONE">1 hồ sơ</option>
              <option value="MULTIPLE">Từ 2 hồ sơ trở lên</option>
            </select>
          </label>

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-800">
            Bộ lọc này giúp Dispatcher chọn đúng cán bộ còn khả năng tiếp nhận
            điều phối, tránh giao thêm nhiệm vụ cho cán bộ đang quá tải hoặc hết
            ca trực.
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-red-100 bg-red-50/50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-red-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-red-50"
          >
            Đặt lại
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-red-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-red-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
          >
            Áp dụng
          </button>
        </div>
      </aside>
    </div>
  );
}
