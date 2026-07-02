"use client";

import { useEffect, useState } from "react";
import type {
  AdminUser,
  AdminUserRole,
} from "@/features/admin-users/types/adminUser.types";

type AdminUpdateRoleModalProps = {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSave: (userId: string, roles: AdminUserRole[]) => void;
};

const roleOptions: Array<{
  value: AdminUserRole;
  title: string;
  description: string;
}> = [
  {
    value: "OFFICER",
    title: "OFFICER",
    description: "Quyền ghi nhận và tiếp nhận thông tin báo cáo cơ bản.",
  },
  {
    value: "DISPATCHER",
    title: "DISPATCHER",
    description: "Quyền điều phối lực lượng và phân loại mức độ khẩn cấp.",
  },
  {
    value: "COMMANDER",
    title: "COMMANDER",
    description: "Quyền chỉ huy, duyệt báo cáo và quyết định hành động.",
  },
  {
    value: "ADMIN",
    title: "ADMIN",
    description: "Quyền quản trị hệ thống, cấu hình và quản lý người dùng.",
  },
];

export function AdminUpdateRoleModal({
  open,
  user,
  onClose,
  onSave,
}: AdminUpdateRoleModalProps) {
  const [roles, setRoles] = useState<AdminUserRole[]>([]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoles(user.roles);
    }
  }, [user]);

  if (!open || !user) return null;

  const activeUser = user;

  function toggleRole(role: AdminUserRole) {
    setRoles((current) => {
      if (current.includes(role)) {
        return current.filter((item) => item !== role);
      }

      return [...current, role];
    });
  }

  function handleSave() {
    if (roles.length === 0) {
      return;
    }

    onSave(activeUser.id, roles);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Cập nhật quyền người dùng
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-slate-950"
          >
            ×
          </button>
        </header>

        <div className="p-6">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <p className="font-black text-slate-950">{activeUser.fullName}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {activeUser.username}
              </p>
            </div>

            <span className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700">
              Current: {activeUser.roles.join(", ")}
            </span>
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold text-slate-700">
              Thiết lập quyền hạn mới
            </p>

            <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
              {roleOptions.map((role) => (
                <label
                  key={role.value}
                  className="flex cursor-pointer gap-4 rounded-lg p-3 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={roles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                    className="mt-1 size-5 accent-(--primary)"
                  />

                  <span>
                    <span className="block font-black text-slate-900">
                      {role.title}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      {role.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-black text-[var(--primary)]">
              Cảnh báo: Việc thay đổi phân quyền có thể ảnh hưởng đến khả năng
              truy cập tài liệu và thao tác trên hệ thống.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              Các phiên đăng nhập hiện tại có thể bị yêu cầu đăng nhập lại để áp
              dụng quyền mới.
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-3 font-black text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
          >
            Lưu thay đổi
          </button>
        </footer>
      </section>
    </div>
  );
}
