"use client";

import { useEffect, useState } from "react";
import { dispatcherAssignedService } from "@/features/dispatcher-assigned/services/dispatcherAssignedService";
import type {
  AssignedCase,
  ReassignUnitOption,
} from "@/features/dispatcher-assigned/types/dispatcherAssigned.types";

type DispatcherReassignUnitModalProps = {
  open: boolean;
  assignedCase: AssignedCase | null;
  onClose: () => void;
  onConfirm: (
    caseItem: AssignedCase,
    option: ReassignUnitOption,
    reason: string,
  ) => void;
};

export function DispatcherReassignUnitModal({
  open,
  assignedCase,
  onClose,
  onConfirm,
}: DispatcherReassignUnitModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [reason, setReason] = useState("");
  const [options, setOptions] = useState<ReassignUnitOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let ignore = false;

    async function loadOptions() {
      setLoading(true);
      setError(null);

      try {
        const data = await dispatcherAssignedService.getReassignOptions();

        if (!ignore) {
          setOptions(data);
          setSelectedOptionId(data[0]?.id ?? "");
        }
      } catch (loadError) {
        if (!ignore) {
          setOptions([]);
          setSelectedOptionId("");
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Khong the tai danh sach can bo kha dung",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadOptions();

    return () => {
      ignore = true;
    };
  }, [open]);

  if (!open || !assignedCase) return null;

  const selectedOption = options.find((item) => item.id === selectedOptionId);
  const canSubmit =
    Boolean(selectedOption?.unitId && selectedOption.officerId) &&
    reason.trim().length > 0;

  function handleConfirm() {
    if (!canSubmit || !assignedCase || !selectedOption) return;

    onConfirm(assignedCase, selectedOption, reason.trim());
    setSelectedOptionId("");
    setReason("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-red-100 bg-red-50 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-red-950">
              Doi don vi dieu phoi
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Ho so #{assignedCase.caseCode} dang duoc giao cho{" "}
              <strong>{assignedCase.assignedUnit}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-slate-900"
          >
            x
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-800">
            He thong chi hien thi can bo dang san sang theo ca truc hien tai.
            Don vi cu se duoc giai phong sau khi doi dieu phoi thanh cong.
          </div>

          <div>
            <p className="text-sm font-black text-slate-700">
              Chon can bo / don vi thay the{" "}
              <span className="text-(--primary)">*</span>
            </p>

            <div className="mt-3 space-y-3">
              {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-500">
                  Dang tai danh sach can bo kha dung...
                </div>
              ) : null}

              {!loading && error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              ) : null}

              {!loading && !error && options.length === 0 ? (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-800">
                  Chua co can bo kha dung de dieu phoi lai.
                </div>
              ) : null}

              {options.map((option) => (
                <label
                  key={option.id}
                  className={[
                    "flex cursor-pointer items-center justify-between rounded-xl border p-4",
                    selectedOptionId === option.id
                      ? "border-(--primary) bg-red-50 ring-2 ring-red-100"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="unit"
                      value={option.id}
                      checked={selectedOptionId === option.id}
                      onChange={(event) =>
                        setSelectedOptionId(event.target.value)
                      }
                      className="size-5 accent-(--primary)"
                    />

                    <div>
                      <p className="font-black text-slate-950">
                        {option.unitCode} - {option.unitName}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {option.officerName ?? "Can bo kha dung"} - ETA{" "}
                        {option.eta} - {option.distance}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                    San sang
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-black text-slate-700">
              Ly do doi don vi <span className="text-(--primary)">*</span>
            </span>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              placeholder="Nhap ly do doi don vi dieu phoi..."
              className="mt-2 w-full resize-none rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />
          </label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-red-100 bg-red-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-red-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-red-50"
          >
            Huy
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleConfirm}
            className="rounded-lg bg-(--primary) px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Xac nhan doi don vi
          </button>
        </footer>
      </section>
    </div>
  );
}
