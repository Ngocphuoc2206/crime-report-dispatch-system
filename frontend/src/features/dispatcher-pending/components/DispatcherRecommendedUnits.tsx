"use client";

import { useState } from "react";
import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import { recommendedDispatchUnits } from "@/features/dispatcher-pending/data/dispatcherPending.data";
import type { RecommendedUnitStatus } from "@/features/dispatcher-pending/types/dispatcherPending.types";

const statusConfig: Record<
  RecommendedUnitStatus,
  {
    label: string;
    className: string;
  }
> = {
  READY: {
    label: "San sang",
    className: "bg-green-50 text-green-700",
  },
  BUSY: {
    label: "Dang ban",
    className: "bg-red-50 text-red-700",
  },
  OFFLINE: {
    label: "Ngoai ca",
    className: "bg-slate-100 text-slate-500",
  },
};

export function DispatcherRecommendedUnits({ caseCode }: { caseCode: string }) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState(false);

  async function handleDispatch(unitCode: string) {
    setDispatching(true);
    setSelectedUnitId(unitCode);

    try {
      await apiClient.post(
        endpoints.dispatchCaseDispatch(caseCode),
        {
          smartDispatch: true,
          note: `Requested from FE unit card ${unitCode}`,
        },
        { auth: true },
      );

      setToast(`Da dieu phoi ${unitCode} toi ho so ${caseCode}`);
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : `Khong the dieu phoi ho so ${caseCode}`,
      );
    } finally {
      setDispatching(false);
    }

    window.setTimeout(() => {
      setToast(null);
    }, 2400);
  }

  return (
    <aside className="relative rounded-xl border border-red-200 bg-red-50/60 p-5 shadow-sm">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-red-100">
          {toast}
        </div>
      ) : null}

      <h2 className="text-2xl font-black text-red-950">Don vi de xuat</h2>

      <div className="mt-5 space-y-4">
        {recommendedDispatchUnits.map((unit) => {
          const status = statusConfig[unit.status];
          const disabled = dispatching || unit.status !== "READY";

          return (
            <article
              key={unit.id}
              className={[
                "rounded-xl border bg-white p-5 shadow-sm",
                selectedUnitId === unit.unitCode
                  ? "border-green-300 ring-2 ring-green-100"
                  : "border-red-200",
                disabled ? "opacity-60" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-full bg-blue-700 text-white">
                      CA
                    </span>

                    <div>
                      <h3 className="text-lg font-black text-slate-950">
                        {unit.unitCode} - {unit.unitName}
                      </h3>

                      <p className="text-sm text-slate-500">{unit.officers}</p>
                    </div>
                  </div>
                </div>

                <span className="rounded-md bg-(--primary) px-3 py-1 text-xs font-black text-white">
                  {unit.matchRate}% phu hop
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-slate-500">ETA</p>
                  <p className="mt-1 font-black text-red-900">{unit.eta}</p>
                </div>

                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-slate-500">Trang thai</p>
                  <p
                    className={["mt-1 font-black", status.className].join(" ")}
                  >
                    {status.label}
                  </p>
                </div>

                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-slate-500">Khoang cach</p>
                  <p className="mt-1 font-black text-slate-900">
                    {unit.distance}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => void handleDispatch(unit.unitCode)}
                className={[
                  "mt-5 w-full rounded-lg px-5 py-3 font-black",
                  disabled
                    ? "cursor-not-allowed bg-red-100 text-red-300"
                    : "bg-(--primary) text-white hover:bg-(--primary-hover)",
                ].join(" ")}
              >
                {dispatching ? "Dang dieu phoi..." : `Dieu phoi ${unit.unitCode}`}
              </button>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
