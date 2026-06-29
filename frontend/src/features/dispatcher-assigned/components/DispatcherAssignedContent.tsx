"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DispatcherAssignedPriorityBadge,
  DispatcherAssignedStatusBadge,
} from "@/features/dispatcher-assigned/components/DispatcherAssignedBadges";
import { DispatcherReassignUnitModal } from "@/features/dispatcher-assigned/components/DispatcherReassignUnitModal";
import { dispatcherAssignedCases } from "@/features/dispatcher-assigned/data/dispatcherAssigned.data";
import { dispatcherAssignedService } from "@/features/dispatcher-assigned/services/dispatcherAssignedService";
import type {
  AssignedCase,
  AssignedCaseStatus,
} from "@/features/dispatcher-assigned/types/dispatcherAssigned.types";

type StatusFilter = "ALL" | AssignedCaseStatus;

export function DispatcherAssignedContent() {
  const [assignedCases, setAssignedCases] = useState<AssignedCase[]>(
    dispatcherAssignedCases,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedCase, setSelectedCase] = useState<AssignedCase | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadAssignedCases() {
      try {
        const data = await dispatcherAssignedService.getAssignedCases();

        if (!ignore) {
          setAssignedCases(data.length > 0 ? data : dispatcherAssignedCases);
        }
      } catch {
        if (!ignore) {
          setAssignedCases(dispatcherAssignedCases);
        }
      }
    }

    void loadAssignedCases();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredCases = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return assignedCases.filter((item) => {
      const matchedKeyword =
        keyword === "" ||
        item.caseCode.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.assignedUnit.toLowerCase().includes(keyword) ||
        item.assignedOfficer.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword);

      const matchedStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchedKeyword && matchedStatus;
    });
  }, [assignedCases, searchTerm, statusFilter]);

  const activeCount = assignedCases.filter(
    (item) => item.status !== "RESOLVED",
  ).length;

  const supportCount = assignedCases.filter(
    (item) => item.status === "NEED_SUPPORT",
  ).length;

  function handleReassign(caseCode: string, unitCode: string) {
    setAssignedCases((current) =>
      current.map((item) =>
        item.caseCode === caseCode
          ? {
              ...item,
              assignedUnit: unitCode,
              status: "DISPATCHED",
              eta: "Đang cập nhật",
            }
          : item,
      ),
    );

    setSelectedCase(null);
    showToast(`Đã đổi đơn vị xử lý cho hồ sơ ${caseCode}`);
  }

  function handleRecall(caseCode: string) {
    setAssignedCases((current) =>
      current.map((item) =>
        item.caseCode === caseCode
          ? {
              ...item,
              status: "DISPATCHED",
              assignedUnit: "Chờ điều phối lại",
              assignedOfficer: "Chưa phân công",
              eta: "--",
            }
          : item,
      ),
    );

    showToast(`Đã thu hồi điều phối hồ sơ ${caseCode}`);
  }

  function showToast(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2400);
  }

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("ALL");
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-red-100">
          ✓ {toast}
        </div>
      ) : null}

      <DispatcherReassignUnitModal
        open={Boolean(selectedCase)}
        assignedCase={selectedCase}
        onClose={() => setSelectedCase(null)}
        onConfirm={handleReassign}
      />

      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Hồ sơ đã phân công
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Theo dõi các tin báo đã được điều phối cho đơn vị xử lý. Kiểm tra
            tiến độ, SLA và đổi đơn vị khi cần thiết.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-bold text-red-900/70">Đang xử lý</p>
            <p className="mt-1 text-3xl font-black text-red-950">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-4">
            <p className="text-sm font-bold text-orange-900/70">Cần hỗ trợ</p>
            <p className="mt-1 text-3xl font-black text-orange-800">
              {supportCount}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-red-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_auto_auto]">
          <label>
            <span className="text-sm font-bold text-slate-600">
              Tìm kiếm hồ sơ / đơn vị / cán bộ
            </span>

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="VD: INC-9021, Unit 405, Nguyễn Văn..."
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none 
              focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-slate-600">
              Trạng thái xử lý
            </span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none 
              focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="DISPATCHED">Đã điều phối</option>
              <option value="ACKNOWLEDGED">Đã tiếp nhận</option>
              <option value="ON_SITE">Đang xử lý hiện trường</option>
              <option value="NEED_SUPPORT">Cần hỗ trợ</option>
              <option value="RESOLVED">Đã xử lý</option>
            </select>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="self-end rounded-lg border border-red-200 px-5 py-3 font-black text-slate-700 hover:bg-red-50"
          >
            Đặt lại
          </button>

          <button
            type="button"
            className="self-end rounded-lg bg-(--primary) px-5 py-3 
            font-black text-white hover:bg-(--primary-hover)"
          >
            Xuất danh sách
          </button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-red-100 bg-red-50 px-5 py-4">
          <h2 className="text-2xl font-black text-red-950">
            Danh sách hồ sơ đang theo dõi
          </h2>

          <p className="text-sm font-bold text-red-900/70">
            {filteredCases.length} kết quả
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-300 text-left text-sm">
            <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Mã hồ sơ</th>
                <th className="px-5 py-4">Vụ việc</th>
                <th className="px-5 py-4">Mức độ</th>
                <th className="px-5 py-4">Đơn vị xử lý</th>
                <th className="px-5 py-4">Cán bộ phụ trách</th>
                <th className="px-5 py-4">ETA</th>
                <th className="px-5 py-4">SLA còn lại</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-red-100">
              {filteredCases.map((item) => (
                <tr key={item.id} className="hover:bg-red-50/50">
                  <td className="px-5 py-5">
                    <p className="font-black text-red-900">#{item.caseCode}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Giao lúc {item.assignedAt}
                    </p>
                  </td>

                  <td className="max-w-sm px-5 py-5">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.location}
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    <DispatcherAssignedPriorityBadge priority={item.priority} />
                  </td>

                  <td className="px-5 py-5 font-black text-slate-900">
                    {item.assignedUnit}
                  </td>

                  <td className="px-5 py-5 text-slate-700">
                    {item.assignedOfficer}
                  </td>

                  <td className="px-5 py-5 font-black text-blue-700">
                    {item.eta}
                  </td>

                  <td
                    className={[
                      "px-5 py-5 font-black",
                      item.status === "NEED_SUPPORT"
                        ? "text-orange-700"
                        : "text-slate-700",
                    ].join(" ")}
                  >
                    {item.slaRemaining}
                  </td>

                  <td className="px-5 py-5">
                    <DispatcherAssignedStatusBadge status={item.status} />
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dispatcher/assigned/${encodeURIComponent(
                          item.caseCode,
                        )}`}
                        className="rounded-lg border border-red-200 px-3 py-2 font-bold text-slate-700 hover:bg-red-50"
                      >
                        Theo dõi
                      </Link>

                      {item.status !== "RESOLVED" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setSelectedCase(item)}
                            className="rounded-lg bg-(--primary) px-3 py-2 font-bold text-white hover:bg-(--primary-hover)"
                          >
                            Đổi đơn vị
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRecall(item.caseCode)}
                            className="rounded-lg border border-orange-200 px-3 py-2 font-bold text-orange-700 hover:bg-orange-50"
                          >
                            Thu hồi
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-red-100 bg-red-50/60 px-5 py-4 text-sm text-slate-600">
          <p>
            Hiển thị 1-{filteredCases.length} trong tổng số{" "}
            {assignedCases.length} hồ sơ đã phân công
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-md px-3 py-2 text-slate-400">‹</button>
            <button className="rounded-md bg-(--primary) px-3 py-2 font-black text-white">
              1
            </button>
            <button className="rounded-md px-3 py-2 font-black text-slate-600">
              2
            </button>
            <button className="rounded-md px-3 py-2 text-slate-600">›</button>
          </div>
        </footer>
      </section>
    </div>
  );
}
