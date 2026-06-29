"use client";

import { useState } from "react";
import { reassignUnitOptions } from "@/features/dispatcher-assigned/data/dispatcherAssigned.data";
import type { AssignedCase } from "@/features/dispatcher-assigned/types/dispatcherAssigned.types";

type DispatcherReassignUnitModalProps = {
  open: boolean;
  assignedCase: AssignedCase | null;
  onClose: () => void;
  onConfirm: (caseCode: string, unitCode: string, reason: string) => void;
};

export function DispatcherReassignUnitModal({
  open,
  assignedCase,
  onClose,
  onConfirm,
}: DispatcherReassignUnitModalProps) {
  const [selectedUnit, setSelectedUnit] = useState("");
  const [reason, setReason] = useState("");

  if (!open || !assignedCase) return null;

  const canSubmit = selectedUnit.trim().length > 0 && reason.trim().length > 0;

  function handleConfirm() {
    if (!canSubmit || !assignedCase) return;

    onConfirm(assignedCase.caseCode, selectedUnit, reason);

    setSelectedUnit("");
    setReason("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-red-100 bg-red-50 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-red-950">
              Đổi đơn vị điều phối
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Hồ sơ #{assignedCase.caseCode} đang được giao cho{" "}
              <strong>{assignedCase.assignedUnit}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-slate-900"
          >
            ×
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-800">
            Việc đổi đơn vị sẽ được ghi vào lịch sử điều phối. Đơn vị cũ sẽ nhận
            thông báo thu hồi nhiệm vụ, đơn vị mới sẽ nhận nhiệm vụ thay thế.
          </div>

          <div>
            <p className="text-sm font-black text-slate-700">
              Chọn đơn vị thay thế <span className="text-(--primary)">*</span>
            </p>

            <div className="mt-3 space-y-3">
              {reassignUnitOptions.map((unit) => {
                const disabled = unit.status === "BUSY";

                return (
                  <label
                    key={unit.id}
                    className={[
                      "flex cursor-pointer items-center justify-between rounded-xl border p-4",
                      selectedUnit === unit.unitCode
                        ? "border-(--primary) bg-red-50 ring-2 ring-red-100"
                        : "border-slate-200 bg-white",
                      disabled ? "cursor-not-allowed opacity-50" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="unit"
                        value={unit.unitCode}
                        disabled={disabled}
                        checked={selectedUnit === unit.unitCode}
                        onChange={(event) =>
                          setSelectedUnit(event.target.value)
                        }
                        className="size-5 accent-(--primary)"
                      />

                      <div>
                        <p className="font-black text-slate-950">
                          {unit.unitCode} - {unit.unitName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          ETA {unit.eta} • {unit.distance}
                        </p>
                      </div>
                    </div>

                    <span
                      className={[
                        "rounded-md px-3 py-1 text-xs font-black",
                        unit.status === "READY"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700",
                      ].join(" ")}
                    >
                      {unit.status === "READY" ? "Sẵn sàng" : "Đang bận"}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-black text-slate-700">
              Lý do đổi đơn vị <span className="text-(--primary)">*</span>
            </span>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              placeholder="Nhập lý do đổi đơn vị điều phối..."
              className="mt-2 w-full resize-none rounded-lg border border-red-200 px-4 py-3 outline-none 
              focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />
          </label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-red-100 bg-red-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-red-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-red-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleConfirm}
            className="rounded-lg bg-(--primary) px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Xác nhận đổi đơn vị
          </button>
        </footer>
      </section>
    </div>
  );
}
