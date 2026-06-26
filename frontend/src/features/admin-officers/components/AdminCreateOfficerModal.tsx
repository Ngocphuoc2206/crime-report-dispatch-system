"use client";

import { useMemo, useState } from "react";
import { adminOfficerUserOptions } from "@/features/admin-officers/data/adminOfficers.data";
import type {
  AdminOfficerProfile,
  AdminOfficerRank,
} from "@/features/admin-officers/types/adminOfficer.types";

type AdminCreateOfficerModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (officer: AdminOfficerProfile) => void;
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

export function AdminCreateOfficerModal({
  open,
  onClose,
  onCreate,
}: AdminCreateOfficerModalProps) {
  const [userId, setUserId] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [rank, setRank] = useState<AdminOfficerRank | "">("");
  const [unitId, setUnitId] = useState("");

  const selectedUser = useMemo(() => {
    return adminOfficerUserOptions.find((user) => user.userId === userId);
  }, [userId]);

  if (!open) return null;

  function handleSubmit() {
    if (!selectedUser || !badgeNumber.trim() || !rank || !unitId.trim()) {
      return;
    }

    const newOfficer: AdminOfficerProfile = {
      id: selectedUser.userId,
      userId: selectedUser.userId,
      officerId: `OFF-${Math.floor(Math.random() * 900 + 100)}`,
      fullName: selectedUser.fullName,
      gender: "Chưa cập nhật",
      dateOfBirth: "Chưa cập nhật",
      phone: selectedUser.phone,
      email: selectedUser.email,
      badgeNumber: badgeNumber.trim(),
      rank,
      unitId: unitId.trim(),
      unitName: `Đơn vị ${unitId.trim()}`,
      joinedAt: new Intl.DateTimeFormat("vi-VN").format(new Date()),
      status: "ACTIVE",
      performance: {
        processedCases: 0,
        slaRate: "0%",
        rating: "Chưa có",
      },
      recentCases: [],
    };

    onCreate(newOfficer);

    setUserId("");
    setBadgeNumber("");
    setRank("");
    setUnitId("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Thêm mới hồ sơ cán bộ
          </h2>

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
                User ID <span className="text-(--primary)">*</span>
              </span>

              <select
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              >
                <option value="">Chọn User Role OFFICER</option>
                {adminOfficerUserOptions.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.userId} - {user.fullName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Họ và tên
              </span>

              <input
                value={selectedUser?.fullName ?? ""}
                disabled
                placeholder="Tự động điền"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Số hiệu cán bộ <span className="text-(--primary)">*</span>
              </span>

              <input
                value={badgeNumber}
                onChange={(event) => setBadgeNumber(event.target.value)}
                placeholder="Nhập số hiệu cán bộ"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Cấp bậc <span className="text-(--primary)">*</span>
              </span>

              <select
                value={rank}
                onChange={(event) =>
                  setRank(event.target.value as AdminOfficerRank)
                }
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              >
                <option value="">Chọn cấp bậc</option>
                {rankOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-7 border-t border-slate-200 pt-6">
            <label>
              <span className="text-sm font-black text-slate-700">
                Mã đơn vị Unit ID <span className="text-(--primary)">*</span>
              </span>

              <input
                value={unitId}
                onChange={(event) => setUnitId(event.target.value)}
                placeholder="Ví dụ: UNIT-Q1"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none 
                focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>

            <p className="mt-2 text-sm text-slate-500">
              Nhập mã đơn vị nghiệp vụ trực thuộc của cán bộ.
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-black 
            text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-(--primary) px-5 py-3 font-black text-white hover:bg-(--primary-hover)"
          >
            Tạo hồ sơ
          </button>
        </footer>
      </section>
    </div>
  );
}
