"use client";

import { useEffect, useState } from "react";
import { dispatcherOfficerUnits } from "@/features/dispatcher-dashboard/data/dispatcherDashboard.data";
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
    label: "Đang xử lý",
    className: "bg-red-50 text-red-700",
    borderClassName: "border-l-red-400",
  },
  OFFLINE: {
    label: "Nghỉ ca",
    className: "bg-slate-100 text-slate-500",
    borderClassName: "border-l-slate-400",
  },
};

export function DispatcherOfficerAvailability() {
  const [units, setUnits] =
    useState<DispatchOfficerUnit[]>(dispatcherOfficerUnits);

  useEffect(() => {
    let ignore = false;

    async function loadUnits() {
      try {
        const data = await dispatcherOfficerService.getAvailability();

        if (!ignore && data.length > 0) {
          setUnits(
            data.slice(0, 6).map((officer) => ({
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
          setUnits(dispatcherOfficerUnits);
        }
      }
    }

    void loadUnits();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <aside className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-red-950">Tình trạng cán bộ</h2>

        <button className="text-xl text-slate-500">≡</button>
      </header>

      <div className="mt-5 grid grid-cols-3 rounded-lg bg-red-50 p-1 text-center text-sm font-bold text-red-900/70">
        <button className="rounded-md bg-white py-2 shadow-sm">Tất cả</button>
        <button className="py-2">Sẵn sàng</button>
        <button className="py-2">Đang bận</button>
      </div>

      <div className="mt-5 space-y-4">
        {units.map((unit) => {
          const status = statusConfig[unit.status];

          return (
            <article
              key={unit.id}
              className={[
                "rounded-lg border border-red-100 border-l-4 bg-white p-4",
                status.borderClassName,
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-950">{unit.unitCode}</h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {unit.zone} - {unit.role}
                  </p>
                </div>

                <span
                  className={[
                    "rounded-md px-3 py-1 text-xs font-black",
                    status.className,
                  ].join(" ")}
                >
                  {status.label}
                </span>
              </div>

              {unit.currentCaseCode ? (
                <p className="mt-4 font-black text-(--primary)">
                  #{unit.currentCaseCode}
                </p>
              ) : null}

              <div className="mt-4 flex items-center justify-between border-t border-red-100 pt-3">
                <span className="text-sm text-slate-600">
                  {unit.distanceToCenter}
                </span>

                {unit.status === "AVAILABLE" ? (
                  <button className="text-sm font-black text-(--primary)">
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
