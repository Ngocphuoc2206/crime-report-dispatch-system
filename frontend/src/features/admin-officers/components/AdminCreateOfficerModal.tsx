"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  AdminOfficerProfile,
  AdminOfficerRank,
} from "@/features/admin-officers/types/adminOfficer.types";
import { adminUserService } from "@/features/admin-users/services/adminUserService";
import type { AdminUser } from "@/features/admin-users/types/adminUser.types";
import { adminUnitService } from "@/features/admin-units/services/adminUnitService";
import type { AdminPoliceUnit } from "@/features/admin-units/types/adminUnit.types";

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
] as AdminOfficerRank[];

export function AdminCreateOfficerModal({
  open,
  onClose,
  onCreate,
}: AdminCreateOfficerModalProps) {
  const [userId, setUserId] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [rank, setRank] = useState<AdminOfficerRank | "">("");
  const [unitId, setUnitId] = useState("");
  const [units, setUnits] = useState<AdminPoliceUnit[]>([]);
  const [userOptions, setUserOptions] = useState<AdminUser[]>([]);
  const [unitError, setUnitError] = useState<string | null>(null);

  const selectedUser = useMemo(
    () => userOptions.find((user) => user.id === userId),
    [userOptions, userId],
  );

  useEffect(() => {
    if (!open) return;

    let ignore = false;

    async function loadUnits() {
      setUnitError(null);

      try {
        const [unitData, userData] = await Promise.all([
          adminUnitService.getUnits(),
          adminUserService.getAll(),
        ]);
        const officerUsers = userData.filter((user) =>
          user.roles.includes("OFFICER"),
        );
        const activeUnits = unitData.filter((unit) => unit.active);

        if (!ignore) {
          setUnits(activeUnits);
          setUserOptions(officerUsers);
          setUnitId((current) => current || activeUnits[0]?.id || "");
        }
      } catch (error) {
        if (!ignore) {
          setUnits([]);
          setUnitError(
            error instanceof Error
              ? error.message
              : "Không tải được danh sách đơn vị",
          );
        }
      }
    }

    void loadUnits();

    return () => {
      ignore = true;
    };
  }, [open]);

  if (!open) return null;

  const selectedUnit = units.find((unit) => unit.id === unitId);

  function handleSubmit() {
    if (!selectedUser || !selectedUnit || !badgeNumber.trim() || !rank) {
      return;
    }

    const newOfficer: AdminOfficerProfile = {
      id: selectedUser.id,
      userId: selectedUser.id,
      officerId: "",
      fullName: selectedUser.fullName,
      gender: "Chưa cập nhật",
      dateOfBirth: "Chưa cập nhật",
      phone: selectedUser.phone,
      email: selectedUser.email,
      badgeNumber: badgeNumber.trim(),
      rank,
      unitId: selectedUnit.id,
      unitName: selectedUnit.name,
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
    setUnitId(units[0]?.id || "");
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
                User ID <span className="text-[var(--primary)]">*</span>
              </span>

              <select
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              >
                <option value="">Chọn người dùng có vai trò OFFICER</option>
                {userOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.id} - {user.fullName}
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
                Số hiệu cán bộ <span className="text-[var(--primary)]">*</span>
              </span>

              <input
                value={badgeNumber}
                onChange={(event) => setBadgeNumber(event.target.value)}
                placeholder="Nhập số hiệu cán bộ"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Cấp bậc <span className="text-[var(--primary)]">*</span>
              </span>

              <select
                value={rank}
                onChange={(event) =>
                  setRank(event.target.value as AdminOfficerRank)
                }
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
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
                Đơn vị công an <span className="text-[var(--primary)]">*</span>
              </span>

              <select
                value={unitId}
                onChange={(event) => setUnitId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              >
                <option value="">Chọn đơn vị</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.id} - {unit.code} - {unit.name}
                  </option>
                ))}
              </select>
            </label>

            {unitError ? (
              <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
                {unitError}
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                Cần tạo đơn vị tại trang Đơn vị công an trước khi lập hồ sơ
                cán bộ.
              </p>
            )}
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!selectedUser || !selectedUnit || !badgeNumber.trim() || !rank}
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Tạo hồ sơ
          </button>
        </footer>
      </section>
    </div>
  );
}
