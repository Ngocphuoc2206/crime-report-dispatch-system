"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CommanderActivityPriorityBadge,
  CommanderActivityTypeBadge,
} from "@/features/commander-activity/components/CommanderActivityBadge";
import { commanderActivityItems } from "@/features/commander-activity/data/commanderActivity.data";
import type {
  CommanderActivityItem,
  CommanderActivityType,
} from "@/features/commander-activity/types/commanderActivity.types";

type ActivityFilter = "ALL" | CommanderActivityType;

const filterOptions: Array<{
  label: string;
  value: ActivityFilter;
}> = [
  {
    label: "Tất cả sự kiện",
    value: "ALL",
  },
  {
    label: "Tiếp nhận khẩn cấp",
    value: "EMERGENCY_SIGNAL",
  },
  {
    label: "Nhận xử lý",
    value: "CASE_ACCEPTED",
  },
  {
    label: "Cập nhật trạng thái",
    value: "STATUS_UPDATED",
  },
  {
    label: "Hoàn tất",
    value: "CASE_COMPLETED",
  },
  {
    label: "Spam",
    value: "SPAM_BLOCKED",
  },
];

function getTimelineIconClassName(item: CommanderActivityItem) {
  if (item.type === "EMERGENCY_SIGNAL") {
    return "border-red-300 bg-red-400/10 text-red-200";
  }

  if (item.type === "CASE_ACCEPTED") {
    return "border-cyan-400 bg-cyan-400/10 text-cyan-300";
  }

  if (item.type === "STATUS_UPDATED") {
    return "border-orange-400 bg-orange-400/10 text-orange-300";
  }

  if (item.type === "CASE_COMPLETED") {
    return "border-green-400 bg-green-400/10 text-green-300";
  }

  return "border-slate-500 bg-slate-500/10 text-slate-400";
}

function getTimelineIcon(item: CommanderActivityItem) {
  if (item.type === "EMERGENCY_SIGNAL") return "⚠";
  if (item.type === "CASE_ACCEPTED") return "▣";
  if (item.type === "STATUS_UPDATED") return "↻";
  if (item.type === "CASE_COMPLETED") return "✓";
  return "⊘";
}

export function CommanderActivityContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("ALL");
  const [pageSize, setPageSize] = useState("20");

  const filteredActivities = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return commanderActivityItems.filter((item) => {
      const matchedKeyword =
        keyword === "" ||
        item.caseCode.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.actor.toLowerCase().includes(keyword);

      const matchedType =
        activityFilter === "ALL" || item.type === activityFilter;

      return matchedKeyword && matchedType;
    });
  }, [searchTerm, activityFilter]);

  function handleResetFilter() {
    setSearchTerm("");
    setActivityFilter("ALL");
  }

  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-100">
            Hoạt động xử lý gần đây
          </h1>

          <p className="mt-3 text-slate-400">
            Giám sát luồng xử lý và trạng thái cập nhật của các tin báo trong hệ
            thống.
          </p>
        </div>

        <label className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-400">Hiển thị:</span>

          <select
            value={pageSize}
            onChange={(event) => setPageSize(event.target.value)}
            className="rounded-md border border-white/10 bg-[#202b55] px-4 py-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400"
          >
            <option value="10">10 sự kiện</option>
            <option value="20">20 sự kiện</option>
            <option value="50">50 sự kiện</option>
          </select>
        </label>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#121b3a]">
        <div className="grid gap-4 border-b border-white/10 p-5 lg:grid-cols-[1fr_auto_auto]">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm mã tin báo, cán bộ, nội dung..."
            className="w-full rounded-md border border-white/10 bg-[#202b55] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <select
            value={activityFilter}
            onChange={(event) =>
              setActivityFilter(event.target.value as ActivityFilter)
            }
            className="rounded-md border border-white/10 bg-[#202b55] px-4 py-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400"
          >
            {filterOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleResetFilter}
            className="rounded-md border border-white/15 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            Đặt lại
          </button>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="flex min-h-88 items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-white/10 text-4xl text-slate-500">
                ⌕
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-100">
                Không tìm thấy sự kiện
              </h2>

              <p className="mt-3 max-w-md text-slate-400">
                Không có hoạt động nào khớp với bộ lọc hoặc từ khóa hiện tại.
              </p>

              <button
                type="button"
                onClick={handleResetFilter}
                className="mt-6 rounded-lg border border-white/15 px-6 py-3 font-bold text-slate-200 hover:bg-white/10"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        ) : (
          <div className="relative p-8">
            <div className="absolute bottom-8 left-[4.15rem] top-8 w-px bg-white/10" />

            <div className="space-y-8">
              {filteredActivities.map((item) => (
                <article
                  key={item.id}
                  className="relative grid grid-cols-[4rem_1fr] gap-4"
                >
                  <div className="relative z-10 flex justify-center">
                    <span
                      className={[
                        "flex size-11 items-center justify-center rounded-xl border text-lg font-bold",
                        getTimelineIconClassName(item),
                      ].join(" ")}
                    >
                      {getTimelineIcon(item)}
                    </span>
                  </div>

                  <div
                    className={[
                      "rounded-lg border bg-[#202b55] p-5",
                      item.type === "EMERGENCY_SIGNAL"
                        ? "border-red-300/30"
                        : "border-white/10",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2
                            className={[
                              "font-mono text-2xl font-black",
                              item.type === "SPAM_BLOCKED"
                                ? "text-slate-500"
                                : "text-slate-100",
                            ].join(" ")}
                          >
                            {item.title}
                          </h2>

                          <CommanderActivityPriorityBadge
                            priority={item.priority}
                          />

                          <CommanderActivityTypeBadge type={item.type} />
                        </div>

                        <p
                          className={[
                            "mt-4 leading-7",
                            item.type === "SPAM_BLOCKED"
                              ? "text-slate-500"
                              : "text-slate-300",
                          ].join(" ")}
                        >
                          {item.description}
                        </p>

                        <p className="mt-3 text-sm text-slate-500">
                          Tác nhân: {item.actor}
                        </p>
                      </div>

                      <div className="shrink-0 text-left lg:text-right">
                        <p className="text-sm font-semibold text-slate-400">
                          {item.timeLabel}
                        </p>

                        <Link
                          href={`/commander/cases/${encodeURIComponent(
                            item.caseCode,
                          )}`}
                          className="mt-6 inline-flex rounded-md border border-cyan-400/60 px-5 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-400/10"
                        >
                          Mở hồ sơ ↗
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <footer className="flex flex-col gap-3 border-t border-white/10 px-6 py-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            Hiển thị {filteredActivities.length} trong tổng số{" "}
            {commanderActivityItems.length} sự kiện
          </p>

          <p>Cập nhật gần nhất: 14:32:45 hôm nay</p>
        </footer>
      </section>
    </div>
  );
}
