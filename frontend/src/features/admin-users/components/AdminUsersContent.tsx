"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminDataTable,
  AdminTableBody,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableShell,
  AdminTd,
  AdminTh,
} from "@/features/admin-dashboard/components/AdminDataTable";
import { AdminCreateUserModal } from "@/features/admin-users/components/AdminCreateUserModal";
import {
  AdminRoleBadge,
  AdminStatusBadge,
} from "@/features/admin-users/components/AdminUserBadges";
import { AdminUpdateRoleModal } from "@/features/admin-users/components/AdminUpdateRoleModal";
import { adminUserService } from "@/features/admin-users/services/adminUserService";
import type {
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
} from "@/features/admin-users/types/adminUser.types";
import { AdminLockUserConfirmModal } from "./AdminLockUserConfirmModal";

type RoleFilter = "ALL" | AdminUserRole;
type StatusFilter = "ALL" | AdminUserStatus;

const pageSize = 10;

export function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [lockingUser, setLockingUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadUsers() {
    setIsLoading(true);
    setApiError(null);

    try {
      const data = await adminUserService.getAll();
      setUsers(data);
    } catch (error) {
      setUsers([]);
      setApiError(
        error instanceof Error
          ? error.message
          : "Không tải được danh sách người dùng.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers();
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedUsers = filteredUsers.slice(pageStart, pageStart + pageSize);
  const visibleStart = filteredUsers.length === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(pageStart + pagedUsers.length, filteredUsers.length);

  function showSuccess(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function resetPaging() {
    setPage(1);
  }

  function handleResetFilter() {
    setSearchTerm("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setPage(1);
  }

  function handleCreateUser(user: AdminUser) {
    void adminUserService
      .create(user)
      .then((createdUser) => {
        setUsers((current) => [createdUser, ...current]);
        setPage(1);
        setCreateModalOpen(false);
        showSuccess("Tạo người dùng thành công");
      })
      .catch((error) => {
        setApiError(
          error instanceof Error ? error.message : "Không tạo được người dùng.",
        );
      });
  }

  function handleSaveRoles(userId: string, roles: AdminUserRole[]) {
    void adminUserService
      .updateRoles(userId, roles)
      .then((updatedUser) => {
        setUsers((current) =>
          current.map((user) => (user.id === userId ? updatedUser : user)),
        );
        setEditingUser(null);
        showSuccess("Cập nhật phân quyền thành công");
      })
      .catch((error) => {
        setApiError(
          error instanceof Error
            ? error.message
            : "Không cập nhật được phân quyền.",
        );
      });
  }

  function handleConfirmLockUser(userId: string) {
    void adminUserService
      .updateStatus(userId, false)
      .then((updatedUser) => {
        setUsers((current) =>
          current.map((user) => (user.id === userId ? updatedUser : user)),
        );
        setLockingUser(null);
        showSuccess("Khóa tài khoản thành công");
      })
      .catch((error) => {
        setApiError(
          error instanceof Error ? error.message : "Không khóa được tài khoản.",
        );
      });
  }

  function handleUnlockUser(userId: string) {
    void adminUserService
      .updateStatus(userId, true)
      .then((updatedUser) => {
        setUsers((current) =>
          current.map((user) => (user.id === userId ? updatedUser : user)),
        );
        showSuccess("Mở khóa tài khoản thành công");
      })
      .catch((error) => {
        setApiError(
          error instanceof Error
            ? error.message
            : "Không mở khóa được tài khoản.",
        );
      });
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          OK {toast}
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

      {apiError ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-[var(--primary)]">
          {apiError}
        </section>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto_auto]">
          <input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              resetPaging();
            }}
            placeholder="Tìm kiếm theo ID, tên, email..."
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          />

          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value as RoleFilter);
              resetPaging();
            }}
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="OFFICER">Cán bộ</option>
            <option value="DISPATCHER">Điều phối</option>
            <option value="COMMANDER">Chỉ huy</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter);
              resetPaging();
            }}
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

      <AdminTableShell>
        <AdminDataTable minWidthClassName="min-w-[1200px]">
          <AdminTableHead>
            <tr>
              <AdminTh>ID</AdminTh>
              <AdminTh>Tên đăng nhập</AdminTh>
              <AdminTh>Họ và tên</AdminTh>
              <AdminTh>Email</AdminTh>
              <AdminTh>Số điện thoại</AdminTh>
              <AdminTh>Vai trò</AdminTh>
              <AdminTh>Trạng thái</AdminTh>
              <AdminTh>Ngày tạo</AdminTh>
              <AdminTh className="text-right">Thao tác</AdminTh>
            </tr>
          </AdminTableHead>

          <AdminTableBody>
            {isLoading ? (
              <AdminTableEmpty colSpan={9}>
                Đang tải danh sách người dùng...
              </AdminTableEmpty>
            ) : null}

            {!isLoading && filteredUsers.length === 0 ? (
              <AdminTableEmpty colSpan={9}>
                Hiện chưa có người dùng nào.
              </AdminTableEmpty>
            ) : null}

            {pagedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <AdminTd className="font-medium text-slate-700">
                  {user.id}
                </AdminTd>
                <AdminTd className="font-black text-slate-950">
                  {user.username}
                </AdminTd>
                <AdminTd className="text-slate-700">{user.fullName}</AdminTd>
                <AdminTd className="text-slate-600">{user.email}</AdminTd>
                <AdminTd className="text-slate-600">{user.phone}</AdminTd>
                <AdminTd>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <AdminRoleBadge key={role} role={role} />
                    ))}
                  </div>
                </AdminTd>
                <AdminTd>
                  <AdminStatusBadge status={user.status} />
                </AdminTd>
                <AdminTd className="text-slate-500">{user.createdAt}</AdminTd>
                <AdminTd>
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

                        setLockingUser(user);
                      }}
                      className={[
                        "rounded-lg px-4 py-2 font-bold",
                        user.status === "LOCKED"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-red-50 text-[var(--primary)] hover:bg-red-100",
                      ].join(" ")}
                    >
                      {user.status === "LOCKED" ? "Mở khóa" : "Khóa"}
                    </button>
                  </div>
                </AdminTd>
              </tr>
            ))}
          </AdminTableBody>
        </AdminDataTable>

        <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            Hiển thị {visibleStart}-{visibleEnd} trong số{" "}
            {filteredUsers.length} người dùng
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-md px-3 py-2 font-black text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              &lt;
            </button>

            <span className="rounded-md bg-[var(--primary)] px-3 py-2 font-black text-white">
              {currentPage}
            </span>

            <span className="px-2 text-slate-500">/ {totalPages}</span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="rounded-md px-3 py-2 font-black text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              &gt;
            </button>
          </div>
        </footer>
      </AdminTableShell>
    </div>
  );
}
