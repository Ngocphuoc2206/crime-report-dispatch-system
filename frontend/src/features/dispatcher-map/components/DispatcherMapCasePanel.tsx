import Link from "next/link";
import {
  DispatcherMapPriorityBadge,
  DispatcherMapStatusBadge,
} from "@/features/dispatcher-map/components/DispatcherMapBadges";
import type { DispatcherMapCase } from "@/features/dispatcher-map/types/dispatcherMap.types";

type DispatcherMapCasePanelProps = {
  selectedCase: DispatcherMapCase | null;
};

export function DispatcherMapCasePanel({
  selectedCase,
}: DispatcherMapCasePanelProps) {
  if (!selectedCase) {
    return (
      <aside className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Chi tiết tin báo</h2>

        <div className="mt-8 rounded-xl border border-dashed border-red-200 bg-red-50/60 p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-3xl">
            📍
          </div>

          <p className="mt-4 text-lg font-black text-slate-800">
            Chọn một điểm trên bản đồ
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Khi chọn marker tin báo, thông tin tóm tắt và thao tác điều phối sẽ
            hiển thị tại đây.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">Mã tin báo</p>
          <h2 className="mt-1 text-2xl font-black text-red-950">
            #{selectedCase.caseCode}
          </h2>
        </div>

        <DispatcherMapPriorityBadge priority={selectedCase.priority} />
      </div>

      <div className="mt-4">
        <DispatcherMapStatusBadge status={selectedCase.status} />
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-sm font-bold text-slate-500">Vụ việc</p>
          <p className="mt-1 text-lg font-black text-slate-950">
            {selectedCase.title}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-500">Địa điểm</p>
          <p className="mt-1 leading-7 text-slate-700">
            {selectedCase.location}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tọa độ từ backend
          </p>
          <p className="mt-2 font-mono text-sm font-bold text-slate-900">
            Lat {selectedCase.lat.toFixed(6)}
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-slate-900">
            Lng {selectedCase.lng.toFixed(6)}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-500">Mô tả nhanh</p>
          <p className="mt-1 leading-7 text-slate-700">
            {selectedCase.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-xs font-bold text-slate-500">Đơn vị gần nhất</p>
            <p className="mt-1 font-black text-slate-950">
              {selectedCase.nearestUnit}
            </p>
          </div>

          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-xs font-bold text-slate-500">ETA</p>
            <p className="mt-1 font-black text-(--primary)">
              {selectedCase.eta}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <Link
          href={`/dispatcher/pending/${encodeURIComponent(
            selectedCase.caseCode,
          )}`}
          className="rounded-lg bg-(--primary) px-5 py-3 text-center font-black text-white hover:bg-(--primary-hover)"
        >
          Mở màn điều phối
        </Link>

        <Link
          href="/dispatcher/pending"
          className="rounded-lg border border-red-200 px-5 py-3 text-center font-black text-slate-700
           hover:bg-red-50"
        >
          Quay lại hàng đợi
        </Link>
      </div>
    </aside>
  );
}
