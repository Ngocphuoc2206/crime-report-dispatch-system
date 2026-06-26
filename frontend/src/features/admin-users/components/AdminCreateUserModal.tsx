"use client";

import { useState } from "react";
import type {
  AdminUser,
  AdminUserRole,
} from "@/features/admin-users/types/adminUser.types";

type AdminCreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (user: AdminUser) => void;
};

const roleOptions: AdminUserRole[] = [
  "OFFICER",
  "DISPATCHER",
  "COMMANDER",
  "ADMIN",
];

export function AdminCreateUserModal({
  open,
  onClose,
  onCreate,
}: AdminCreateUserModalProps) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState<AdminUserRole[]>(["OFFICER"]);

  if (!open) return null;

  function toggleRole(role: AdminUserRole) {
    setRoles((current) => {
      if (current.includes(role)) {
        return current.filter((item) => item !== role);
      }

      return [...current, role];
    });
  }

  function handleSubmit() {
    if (!username.trim() || !fullName.trim() || !password.trim()) {
      return;
    }

    if (roles.length === 0) {
      return;
    }

    const newUser: AdminUser = {
      id: `USR-${Math.floor(Math.random() * 900 + 100)}`,
      username: username.trim(),
      fullName: fullName.trim(),
      email: email.trim() || "chua-cap-nhat@hethong.gov.vn",
      phone: phone.trim() || "Chưa cập nhật",
      roles,
      status: "ACTIVE",
      createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date()),
    };

    onCreate(newUser);

    setUsername("");
    setFullName("");
    setPassword("");
    setEmail("");
    setPhone("");
    setRoles(["OFFICER"]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Tạo người dùng mới
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
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Username <span className="text-(--primary)">*</span>
              </span>

              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Họ và tên <span className="text-(--primary)">*</span>
              </span>

              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Nhập họ và tên"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-slate-700">
              Mật khẩu <span className="text-(--primary)">*</span>
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            />
          </label>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Email</span>

              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Số điện thoại
              </span>

              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Nhập số điện thoại"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-(--primary) focus:ring-4 focus:ring-red-100"
              />
            </label>
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold text-slate-700">
              Phân quyền người dùng
            </p>

            <div className="mt-3 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-2">
              {roleOptions.map((role) => (
                <label
                  key={role}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={roles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="size-5 accent-(--primary)"
                  />

                  <span className="font-bold text-slate-700">{role}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-5 py-3 font-black text-slate-600 hover:bg-slate-100"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-(--primary-hover)"
          >
            Tạo người dùng
          </button>
        </footer>
      </section>
    </div>
  );
}
