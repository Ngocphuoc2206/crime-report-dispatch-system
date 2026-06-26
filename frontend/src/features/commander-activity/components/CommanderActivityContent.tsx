"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CommanderActivityPriorityBadge,
  CommanderActivityTypeBadge,
} from "@/features/commander-activity/components/CommanderActivityBadge";
import { commanderActivityItems } from "@/features/commander-activity/data/commanderActivity.data";
import type {
  CommanderActivityItem,
  CommanderActivityType,
} from "@/features/commander-activity/types/commanderActivity.types";
import { commanderCaseService } from "@/features/commander-cases/services/commanderCaseService";

type ActivityFilter = "ALL" | CommanderActivityType;

const filterOptions: Array<{
  label: string;
  value: ActivityFilter;
}> = [
  { label: "Tat ca su kien", value: "ALL" },
  { label: "Tiep nhan khan cap", value: "EMERGENCY_SIGNAL" },
  { label: "Nhan xu ly", value: "CASE_ACCEPTED" },
  { label: "Cap nhat trang thai", value: "STATUS_UPDATED" },
  { label: "Hoan tat", value: "CASE_COMPLETED" },
  { label: "Spam", value: "SPAM_BLOCKED" },
];

function getTimelineIconClassName(item: CommanderActivityItem) {
  if (item.type === "EMERGENCY_SIGNAL") {
    return "border-red-200 bg-red-50 text-[var(--primary)]";
  }

  if (item.type === "CASE_ACCEPTED") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (item.type === "STATUS_UPDATED") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  if (item.type === "CASE_COMPLETED") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-500";
}

function getTimelineIcon(item: CommanderActivityItem) {
  if (item.type === "EMERGENCY_SIGNAL") return "!";
  if (item.type === "CASE_ACCEPTED") return "A";
  if (item.type === "STATUS_UPDATED") return "U";
  if (item.type === "CASE_COMPLETED") return "OK";
  return "X";
}

export function CommanderActivityContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("ALL");
  const [pageSize, setPageSize] = useState("20");
  const [activities, setActivities] =
    useState<CommanderActivityItem[]>(commanderActivityItems);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadActivities(limit = Number(pageSize)) {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await commanderCaseService.getActivity(limit);
      setActivities(
        response.map((item) => ({
          id: String(item.id),
          caseCode: item.trackingCode,
          title: item.action,
          description: item.description,
          type:
            item.action === "COMMANDER_STATUS_CHANGED"
              ? "STATUS_UPDATED"
              : "CASE_ACCEPTED",
          priority: item.urgencyLevel,
          timeLabel: new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          }).format(new Date(item.createdAt)),
          occurredAt: item.createdAt,
          actor: item.actor,
        })),
      );
    } catch {
      setActivities(commanderActivityItems);
      setApiError(
        "Khong ket noi duoc backend commander activity. Dang hien thi du lieu mau.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredActivities = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return activities.filter((item) => {
      const matchedKeyword =
        keyword === "" ||
        item.caseCode.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.actor.toLowerCase().includes(keyword);

      const matchedType =
        activityFilter === "ALL" || item.type === activityFilter;

      return matchedKeyword && matchedType;
    });
  }, [activities, searchTerm, activityFilter]);

  function handleResetFilter() {
    setSearchTerm("");
    setActivityFilter("ALL");
  }

  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Hoat dong xu ly gan day
          </h1>

          <p className="mt-3 text-slate-600">
            Giam sat luong xu ly va trang thai cap nhat cua cac tin bao trong he
            thong.
          </p>
        </div>

        <label className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-600">Hien thi:</span>

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(event.target.value);
              void loadActivities(Number(event.target.value));
            }}
            className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          >
            <option value="10">10 su kien</option>
            <option value="20">20 su kien</option>
            <option value="50">50 su kien</option>
          </select>
        </label>
      </section>

      {apiError ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-[var(--primary)]">
          {apiError}
        </section>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-4 border-b border-slate-200 p-5 lg:grid-cols-[1fr_auto_auto]">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tim ma tin bao, can bo, noi dung..."
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          />

          <select
            value={activityFilter}
            onChange={(event) =>
              setActivityFilter(event.target.value as ActivityFilter)
            }
            className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
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
            className="rounded-md border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Dat lai
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center font-semibold text-slate-600">
            Dang tai hoat dong gan day...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex min-h-88 items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-slate-100 text-4xl text-slate-500">
                ?
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-950">
                Khong tim thay su kien
              </h2>

              <p className="mt-3 max-w-md text-slate-600">
                Khong co hoat dong nao khop voi bo loc hoac tu khoa hien tai.
              </p>

              <button
                type="button"
                onClick={handleResetFilter}
                className="mt-6 rounded-lg border border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                Xoa bo loc
              </button>
            </div>
          </div>
        ) : (
          <div className="relative p-8">
            <div className="absolute bottom-8 left-[4.15rem] top-8 w-px bg-slate-200" />

            <div className="space-y-8">
              {filteredActivities.map((item) => (
                <article
                  key={item.id}
                  className="relative grid grid-cols-[4rem_1fr] gap-4"
                >
                  <div className="relative z-10 flex justify-center">
                    <span
                      className={[
                        "flex size-11 items-center justify-center rounded-xl border text-sm font-bold",
                        getTimelineIconClassName(item),
                      ].join(" ")}
                    >
                      {getTimelineIcon(item)}
                    </span>
                  </div>

                  <div
                    className={[
                      "rounded-lg border bg-slate-50 p-5",
                      item.type === "EMERGENCY_SIGNAL"
                        ? "border-red-200"
                        : "border-slate-200",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="font-mono text-2xl font-black text-slate-950">
                            {item.title}
                          </h2>

                          <CommanderActivityPriorityBadge
                            priority={item.priority}
                          />

                          <CommanderActivityTypeBadge type={item.type} />
                        </div>

                        <p className="mt-4 leading-7 text-slate-700">
                          {item.description}
                        </p>

                        <p className="mt-3 text-sm text-slate-500">
                          Tac nhan: {item.actor}
                        </p>
                      </div>

                      <div className="shrink-0 text-left lg:text-right">
                        <p className="text-sm font-semibold text-slate-500">
                          {item.timeLabel}
                        </p>

                        <Link
                          href={`/commander/cases/${encodeURIComponent(
                            item.caseCode,
                          )}`}
                          className="mt-6 inline-flex rounded-md border border-red-200 px-5 py-2 text-sm font-bold text-[var(--primary)] hover:bg-red-50"
                        >
                          Mo ho so
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            Hien thi {filteredActivities.length} trong tong so{" "}
            {activities.length} su kien
          </p>

          <p>Cap nhat gan nhat: 14:32:45 hom nay</p>
        </footer>
      </section>
    </div>
  );
}
