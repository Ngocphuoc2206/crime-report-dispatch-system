"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  OfficerCasePriorityBadge,
  OfficerCaseStatusBadge,
} from "@/features/officer-cases/components/OfficerCaseBadge";
import { mockOfficerCases } from "@/features/officer-cases/data/officerCases.data";
import type { OfficerCaseStatus } from "@/features/officer-cases/types/officerCase.types";

type StatusFilter = "ALL" | OfficerCaseStatus;

export function OfficerCaseInboxContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filteredCases = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return mockOfficerCases.filter((item) => {
      const matchedSearch =
        keyword === "" ||
        item.code.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword);

      const matchedStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchedSearch && matchedStatus;
    });
  }, [searchTerm, statusFilter]);

  const newCount = mockOfficerCases.filter(
    (item) => item.status === "NEW",
  ).length;
  const verifyingCount = mockOfficerCases.filter(
    (item) => item.status === "VERIFYING",
  ).length;
  const urgentCount = mockOfficerCases.filter(
    (item) => item.priority === "URGENT",
  ).length;

  return (
    <div className="px-6 py-8">
      <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Danh sách tin báo được giao
          </h1>

          <p className="mt-2 text-slate-600">
            Quản lý và xử lý các thông tin phản ánh từ người dân.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-md border border-(--border) bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-red-50 hover:text-(--primary)">
            Lọc dữ liệu
          </button>

          <button className="rounded-md bg-(--primary) px-5 py-3 text-sm font-bold text-white hover:bg-(--primary-hover)">
            + Tạo tin báo mới
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-slate-500">Tổng số</p>
          <p className="mt-4 text-4xl font-bold text-slate-950">
            {mockOfficerCases.length}
          </p>
        </article>

        <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-slate-500">
            Mới tiếp nhận
          </p>
          <p className="mt-4 text-4xl font-bold text-slate-950">{newCount}</p>
        </article>

        <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-slate-500">
            Đang xác minh
          </p>
          <p className="mt-4 text-4xl font-bold text-blue-700">
            {verifyingCount}
          </p>
        </article>

        <article className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-(--primary)">
            Khẩn cấp
          </p>
          <p className="mt-4 text-4xl font-bold text-(--primary)">
            {urgentCount}
          </p>
        </article>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-(--border) bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-(--border) p-5 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm nội dung, mã hồ sơ, địa điểm..."
            className="w-full rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100 lg:w-96"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="NEW">Mới tiếp nhận</option>
            <option value="VERIFYING">Đang xác minh</option>
            <option value="NEEDS_ADDITIONAL_EVIDENCE">Cần bổ sung</option>
            <option value="RESOLVED">Đã xử lý</option>
            <option value="REJECTED">Hồ sơ giả / Spam</option>
            <option value="CLOSED">Đã kết thúc</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Mã tin báo</th>
                <th className="px-5 py-4">Nội dung</th>
                <th className="px-5 py-4">Địa điểm</th>
                <th className="px-5 py-4">Mức nguy cấp</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Cán bộ</th>
                <th className="px-5 py-4">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--border)">
              {filteredCases.map((item) => (
                <tr key={item.code} className="hover:bg-red-50/40">
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {item.code}
                  </td>

                  <td className="max-w-md px-5 py-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-slate-600">
                      {item.summary}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-700">{item.location}</td>

                  <td className="px-5 py-4">
                    <OfficerCasePriorityBadge priority={item.priority} />
                  </td>

                  <td className="px-5 py-4">
                    <OfficerCaseStatusBadge status={item.status} />
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {item.assignedOfficerName ?? "Chưa phân công"}
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/officer/cases/${encodeURIComponent(item.code)}`}
                      className="rounded-md border border-slate-300 px-4 py-2 font-bold text-slate-700 
                      hover:border-(--primary) hover:bg-red-50 hover:text-(--primary)"
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="border-t border-(--border) bg-slate-50 px-5 py-4 text-sm text-slate-600">
          Hiển thị {filteredCases.length} / {mockOfficerCases.length} hồ sơ
        </footer>
      </section>
    </div>
  );
}
