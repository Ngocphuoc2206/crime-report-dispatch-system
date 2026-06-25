"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  OfficerCasePriorityBadge,
  OfficerCaseStatusBadge,
} from "@/features/officer-cases/components/OfficerCaseBadge";
import {
  CURRENT_OFFICER_ID,
  CURRENT_OFFICER_NAME,
  mockOfficerCases,
} from "@/features/officer-cases/data/officerCases.data";
import type {
  OfficerCase,
  OfficerCaseStatus,
} from "@/features/officer-cases/types/officerCase.types";

type MyCaseFilter =
  | "ALL"
  | "URGENT"
  | "VERIFYING"
  | "NEEDS_ADDITIONAL_EVIDENCE";

const filterOptions: Array<{
  label: string;
  value: MyCaseFilter;
}> = [
  { label: "Tất cả", value: "ALL" },
  { label: "Khẩn cấp", value: "URGENT" },
  { label: "Đang xác minh", value: "VERIFYING" },
  { label: "Chờ bổ sung", value: "NEEDS_ADDITIONAL_EVIDENCE" },
];

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getLockText(item: OfficerCase) {
  if (item.lock?.lockedById === CURRENT_OFFICER_ID) {
    const diff = new Date(item.lock.expiresAt).getTime() - Date.now();
    const minutes = Math.max(0, Math.floor(diff / 1000 / 60));
    const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

    return {
      label: `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`,
      tone: "danger" as const,
    };
  }

  if (item.lock) {
    return {
      label: `Đã khóa bởi ${item.lock.lockedByName}`,
      tone: "muted" as const,
    };
  }

  if (item.status === "NEEDS_ADDITIONAL_EVIDENCE") {
    return {
      label: "Chờ người dân bổ sung",
      tone: "warning" as const,
    };
  }

  return {
    label: "Chưa khóa",
    tone: "normal" as const,
  };
}

function isMyCase(item: OfficerCase) {
  return (
    item.assignedOfficerName === CURRENT_OFFICER_NAME ||
    item.lock?.lockedById === CURRENT_OFFICER_ID
  );
}

function matchFilter(item: OfficerCase, filter: MyCaseFilter) {
  if (filter === "ALL") return true;

  if (filter === "URGENT") {
    return item.priority === "URGENT";
  }

  if (filter === "VERIFYING") {
    return item.status === "VERIFYING";
  }

  if (filter === "NEEDS_ADDITIONAL_EVIDENCE") {
    return item.status === "NEEDS_ADDITIONAL_EVIDENCE";
  }

  return true;
}

export function OfficerMyCasesContent() {
  const [activeFilter, setActiveFilter] = useState<MyCaseFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const myCases = useMemo(() => {
    return mockOfficerCases.filter(isMyCase);
  }, []);

  const filteredCases = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return myCases.filter((item) => {
      const matchedKeyword =
        keyword === "" ||
        item.code.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.summary.toLowerCase().includes(keyword);

      return matchedKeyword && matchFilter(item, activeFilter);
    });
  }, [myCases, activeFilter, searchTerm]);

  function getFilterCount(filter: MyCaseFilter) {
    return myCases.filter((item) => matchFilter(item, filter)).length;
  }

  return (
    <div className="px-6 py-8">
      <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Hồ sơ của tôi</h1>

          <p className="mt-2 text-slate-600">
            Danh sách các hồ sơ bạn đang trực tiếp xử lý hoặc đang giữ khóa.
          </p>
        </div>

        <button
          className="rounded-md border border-(--border) bg-white px-5 py-3 text-sm font-bold 
        text-slate-700 hover:bg-red-50 hover:text-(--primary)"
        >
          Lọc trạng thái
        </button>
      </section>

      <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => {
            const active = activeFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className={[
                  "rounded-xl border px-5 py-3 text-sm font-bold transition",
                  active
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-(--border) bg-white text-slate-600 hover:border-(--primary) hover:text-(--primary)",
                ].join(" ")}
              >
                {option.label} ({getFilterCount(option.value)})
              </button>
            );
          })}
        </div>

        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tìm mã hồ sơ, nội dung..."
          className="w-full rounded-md border border-(--border) bg-white px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100 lg:w-80"
        />
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-(--border) bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Mã hồ sơ</th>
                <th className="px-5 py-4">Nội dung</th>
                <th className="px-5 py-4">Thời gian tiếp nhận</th>
                <th className="px-5 py-4">Case lock</th>
                <th className="px-5 py-4">Mức độ</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--border)">
              {filteredCases.map((item) => {
                const lock = getLockText(item);

                return (
                  <tr key={item.code} className="hover:bg-red-50/40">
                    <td className="px-5 py-5 align-top font-bold text-slate-900">
                      {item.code}
                    </td>

                    <td className="max-w-md px-5 py-5 align-top">
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>

                      <p className="mt-1 line-clamp-2 text-slate-600">
                        {item.summary}
                      </p>
                    </td>

                    <td className="px-5 py-5 align-top text-slate-700">
                      {formatDateTime(item.submittedAt)}
                    </td>

                    <td className="px-5 py-5 align-top">
                      <span
                        className={[
                          "inline-flex rounded-md px-3 py-1 text-sm font-bold",
                          lock.tone === "danger"
                            ? "bg-red-50 text-[var(--primary)]"
                            : lock.tone === "warning"
                              ? "bg-orange-50 text-orange-700"
                              : lock.tone === "muted"
                                ? "bg-slate-100 text-slate-500"
                                : "bg-green-50 text-green-700",
                        ].join(" ")}
                      >
                        {lock.label}
                      </span>
                    </td>

                    <td className="px-5 py-5 align-top">
                      <OfficerCasePriorityBadge priority={item.priority} />
                    </td>

                    <td className="px-5 py-5 align-top">
                      <OfficerCaseStatusBadge status={item.status} />
                    </td>

                    <td className="px-5 py-5 align-top">
                      <Link
                        href={`/officer/my-cases/${encodeURIComponent(
                          item.code,
                        )}`}
                        className="inline-flex rounded-md border border-slate-300 px-4 py-2 font-bold 
                        text-slate-700 hover:border-(--primary) hover:bg-red-50 hover:text-(--primary)"
                      >
                        Xem chi tiết →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-4 border-t border-(--border) bg-slate-50 px-5 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            Hiển thị {filteredCases.length} trong tổng số {myCases.length} hồ sơ
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-md px-3 py-2 text-slate-400">‹</button>
            <button className="rounded-md bg-slate-950 px-3 py-2 font-bold text-white">
              1
            </button>
            <button className="rounded-md px-3 py-2 font-bold text-slate-600">
              2
            </button>
            <button className="rounded-md px-3 py-2 text-slate-600">›</button>
          </div>
        </footer>
      </section>
    </div>
  );
}
