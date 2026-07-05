"use client";

import { useEffect, useState } from "react";
import type {
  DispatchOfficerStatus,
  DispatchOfficerUnit,
} from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";
import { dispatcherOfficerService } from "@/features/dispatcher-officers/services/dispatcherOfficerService";

const statusConfig: Record<
  DispatchOfficerStatus,
  {
    label: string;
    className: string;
    borderClassName: string;
  }
> = {
  AVAILABLE: {
    label: "Sẵn sàng",
    className: "bg-green-50 text-green-700",
    borderClassName: "border-l-green-500",
  },
  BUSY: {
    label: "Đang bận",
    className: "bg-red-50 text-red-700",
    borderClassName: "border-l-red-400",
  },
  OFFLINE: {
    label: "Nghỉ ca",
    className: "bg-slate-100 text-slate-500",
    borderClassName: "border-l-slate-400",
  },
};

type OfficerAvailabilityFilter = "ALL" | "AVAILABLE" | "BUSY";

const filterOptions: Array<{
  value: OfficerAvailabilityFilter;
  label: string;
}> = [
  { value: "ALL", label: "Tất cả" },
  { value: "AVAILABLE", label: "Sẵn sàng" },
  { value: "BUSY", label: "Đang bận" },
];

export function DispatcherOfficerAvailability() {
  const [units, setUnits] = useState<DispatchOfficerUnit[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<OfficerAvailabilityFilter>("ALL");

  useEffect(() => {
    let ignore = false;

    async function loadUnits() {
      try {
        const data = await dispatcherOfficerService.getAvailability();

        if (!ignore) {
          setUnits(
            data.map((officer) => ({
              id: officer.id,
              unitCode: officer.unitCode,
              name: officer.fullName,
              zone: officer.lastLocation,
              role: officer.badgeNumber,
              status:
                officer.status === "AVAILABLE"
                  ? "AVAILABLE"
                  : officer.status === "OFF_DUTY"
                    ? "OFFLINE"
                    : "BUSY",
              currentCaseCode: officer.currentCaseCode ?? undefined,
              distanceToCenter: officer.lastUpdated,
            })),
          );
        }
      } catch {
        if (!ignore) {
          setUnits([]);
        }
      }
    }

    void loadUnits();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredUnits = units.filter((unit) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "AVAILABLE") return unit.status === "AVAILABLE";

    return unit.status === "BUSY";
  });

  return (
    <aside className="flex max-h-[42rem] flex-col rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Tình trạng cán bộ
          </h2>
          <p className="mt-1 text-xs font-semibold uppercase text-slate-500">
            {filteredUnits.length} / {units.length} cán bộ
          </p>
        </div>

        <button className="text-sm font-bold text-slate-500">...</button>
      </header>

      <div className="mx-6 mt-5 grid shrink-0 grid-cols-3 rounded-lg bg-slate-50 p-1 text-center text-sm font-bold text-slate-600 ring-1 ring-slate-200">
        {filterOptions.map((option) => {
          const isActive = option.value === activeFilter;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setActiveFilter(option.value)}
              className={[
                "rounded-md py-2 transition",
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "hover:bg-white/70 hover:text-slate-900",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-6 pr-4 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
        {filteredUnits.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
            {units.length === 0
              ? "Hiện chưa có cán bộ trực ban."
              : "Không có cán bộ phù hợp với bộ lọc này."}
          </p>
        ) : null}

        {filteredUnits.map((unit) => {
          const status = statusConfig[unit.status];

          return (
            <article
              key={`${unit.id}-${unit.currentCaseCode ?? "idle"}`}
              className={[
                "rounded-lg border border-slate-200 border-l-4 bg-white p-4",
                status.borderClassName,
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-950">{unit.unitCode}</h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {unit.zone} - {unit.role}
                  </p>
                </div>

                <span
                  className={[
                    "rounded-md px-3 py-1 text-xs font-bold",
                    status.className,
                  ].join(" ")}
                >
                  {status.label}
                </span>
              </div>

              {unit.currentCaseCode ? (
                <p className="mt-4 font-bold text-(--primary)">
                  #{unit.currentCaseCode}
                </p>
              ) : null}

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-sm text-slate-600">
                  {unit.distanceToCenter}
                </span>

                {unit.status === "AVAILABLE" ? (
                  <button className="text-sm font-bold text-(--primary)">
                    Điều phối
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
