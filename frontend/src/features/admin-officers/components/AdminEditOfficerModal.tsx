"use client";

import { useEffect, useState } from "react";
import type {
  AdminOfficerProfile,
  AdminOfficerRank,
} from "@/features/admin-officers/types/adminOfficer.types";

type AdminEditOfficerModalProps = {
  open: boolean;
  officer: AdminOfficerProfile;
  onClose: () => void;
  onSave: (updatedOfficer: AdminOfficerProfile, note: string) => void;
};

const rankOptions: AdminOfficerRank[] = [
  "Thiếu úy",
  "Trung úy",
  "Thượng úy",
  "Đại úy",
  "Thiếu tá",
  "Trung tá",
  "Điều tra viên cao cấp",
];

export function AdminEditOfficerModal({
  open,
  officer,
  onClose,
  onSave,
}: AdminEditOfficerModalProps) {
  const [badgeNumber, setBadgeNumber] = useState(officer.badgeNumber);
  const [rank, setRank] = useState<AdminOfficerRank>(officer.rank);
  const [unitId, setUnitId] = useState(officer.unitId);
  const [note, setNote] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBadgeNumber(officer.badgeNumber);
    setRank(officer.rank);
    setUnitId(officer.unitId);
    setNote("");
  }, [officer]);

  if (!open) return null;

  function handleSave() {
    if (!badgeNumber.trim() || !unitId.trim()) return;

    onSave(
      {
        ...officer,
        badgeNumber: badgeNumber.trim(),
        rank,
        unitId: unitId.trim(),
        unitName: `Đơn vị ${unitId.trim()}`,
      },
      note.trim(),
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-7 py-5">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Chỉnh sửa hồ sơ cán bộ
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Cán bộ: {officer.fullName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-500 hover:text-slate-950"
          >
            ×
          </button>
        </header>

        <div className="p-7">
          <div className="grid gap-6 md:grid-cols-2">
            <label>
              <span className="text-sm font-black text-slate-700">
                User ID hệ thống
              </span>

              <input
                value={officer.officerId}
                disabled
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Số hiệu cán bộ
              </span>

              <input
                value={badgeNumber}
                onChange={(event) => setBadgeNumber(event.target.value)}
                className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">Cấp bậc</span>

              <select
                value={rank}
                onChange={(event) =>
                  setRank(event.target.value as AdminOfficerRank)
                }
                className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              >
                {rankOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Mã đơn vị Unit ID
              </span>

              <input
                value={unitId}
                onChange={(event) => setUnitId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-black text-slate-700">
              Ghi chú thay đổi
            </span>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder="Nhập lý do thay đổi thông tin hồ sơ..."
              className="mt-2 w-full resize-none rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />
          </label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-3 font-black text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-(--primary) px-5 py-3 font-black text-white hover:bg-(--primary-hover)"
          >
            Lưu thay đổi
          </button>
        </footer>
      </section>
    </div>
  );
}
