"use client";

import { useMemo, useState } from "react";
import { AdminCreateUserModal } from "@/features/admin-users/components/AdminCreateUserModal";
import {
  AdminRoleBadge,
  AdminStatusBadge,
} from "@/features/admin-users/components/AdminUserBadges";
import { AdminUpdateRoleModal } from "@/features/admin-users/components/AdminUpdateRoleModal";
import { adminUsers as initialAdminUsers } from "@/features/admin-users/data/adminUsers.data";
import type {
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
} from "@/features/admin-users/types/adminUser.types";
import { AdminLockUserConfirmModal } from "./AdminLockUserConfirmModal";

type RoleFilter = "ALL" | AdminUserRole;
type StatusFilter = "ALL" | AdminUserStatus;

export function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [lockingUser, setLockingUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchedKeyword =
        keyword === "" ||
        user.id.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword) ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.toLowerCase().includes(keyword);

      const matchedRole =
        roleFilter === "ALL" || user.roles.includes(roleFilter);

      const matchedStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchedKeyword && matchedRole && matchedStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  function showSuccess(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  function handleResetFilter() {
    setSearchTerm("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  }

  function handleCreateUser(user: AdminUser) {
    setUsers((current) => [user, ...current]);
    setCreateModalOpen(false);
    showSuccess("Tạo người dùng thành công");
  }

  function handleSaveRoles(userId: string, roles: AdminUserRole[]) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              roles,
            }
          : user,
      ),
    );

    setEditingUser(null);
    showSuccess("Cập nhật phân quyền thành công");
  }

  function handleRequestLockUser(user: AdminUser) {
    setLockingUser(user);
  }

  function handleConfirmLockUser(userId: string) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: "LOCKED",
            }
          : user,
      ),
    );

    setLockingUser(null);
    showSuccess("Khóa tài khoản thành công");
  }

  function handleUnlockUser(userId: string) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: "ACTIVE",
            }
          : user,
      ),
    );

    showSuccess("Mở khóa tài khoản thành công");
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          ✓ {toast}
        </div>
      ) : null}

      <AdminCreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />

      <AdminUpdateRoleModal
        open={Boolean(editingUser)}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveRoles}
      />

      <AdminLockUserConfirmModal
        open={Boolean(lockingUser)}
        user={lockingUser}
        onClose={() => setLockingUser(null)}
        onConfirm={handleConfirmLockUser}
      />

      <section>
        <h1 className="text-4xl font-black text-slate-950">
          Quản lý người dùng
        </h1>

        <p className="mt-3 text-slate-600">
          Tạo tài khoản, phân quyền và kiểm soát trạng thái truy cập hệ thống.
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto_auto]">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm theo ID, tên, email..."
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          />

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as RoleFilter)
            }
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          >
            <option value="ALL">Tất cả Role</option>
            <option value="OFFICER">Officer</option>
            <option value="DISPATCHER">Dispatcher</option>
            <option value="COMMANDER">Commander</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LOCKED">Đã khóa</option>
            <option value="PENDING">Đang chờ</option>
          </select>

          <button
            type="button"
            onClick={handleResetFilter}
            className="rounded-lg px-5 py-3 font-black text-slate-600 hover:bg-slate-100"
          >
            Đặt lại
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
          >
            Tạo người dùng
          </button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Username</th>
                <th className="px-5 py-4">Họ và tên</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Số điện thoại</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-5 py-5 font-medium text-slate-700">
                    {user.id}
                  </td>

                  <td className="px-5 py-5 font-black text-slate-950">
                    {user.username}
                  </td>

                  <td className="px-5 py-5 text-slate-700">{user.fullName}</td>

                  <td className="px-5 py-5 text-slate-600">{user.email}</td>

                  <td className="px-5 py-5 text-slate-600">{user.phone}</td>

                  <td className="px-5 py-5">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <AdminRoleBadge key={role} role={role} />
                      ))}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <AdminStatusBadge status={user.status} />
                  </td>

                  <td className="px-5 py-5 text-slate-500">{user.createdAt}</td>

                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingUser(user)}
                        className="rounded-lg border border-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-blue-50"
                      >
                        Phân quyền
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (user.status === "LOCKED") {
                            handleUnlockUser(user.id);
                            return;
                          }

                          handleRequestLockUser(user);
                        }}
                        className={[
                          "rounded-lg px-4 py-2 font-bold",
                          user.status === "LOCKED"
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-(--primary) hover:bg-red-100",
                        ].join(" ")}
                      >
                        {user.status === "LOCKED" ? "Mở khóa" : "Khóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            Hiển thị 1-{filteredUsers.length} trong số {users.length} người dùng
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-md px-3 py-2 text-slate-400">‹</button>
            <button className="rounded-md bg-slate-200 px-3 py-2 font-black text-slate-800">
              1
            </button>
            <button className="rounded-md px-3 py-2 font-black text-slate-600">
              2
            </button>
            <button className="rounded-md px-3 py-2 font-black text-slate-600">
              3
            </button>
            <span className="px-2 text-slate-400">...</span>
            <button className="rounded-md px-3 py-2 text-slate-600">›</button>
          </div>
        </footer>
      </section>
    </div>
  );
}
