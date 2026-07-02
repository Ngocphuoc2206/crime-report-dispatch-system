import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type { AdminUser, AdminUserRole } from "@/features/admin-users/types/adminUser.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

type AdminUserApiItem = {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  roles: string[];
  createdAt: string;
};

function toUser(item: AdminUserApiItem): AdminUser {
  return {
    id: String(item.id),
    username: item.username,
    fullName: item.fullName,
    email: item.email ?? "",
    phone: item.phone ?? "",
    roles: item.roles as AdminUserRole[],
    status: item.active ? "ACTIVE" : "LOCKED",
    createdAt: formatVietnamDateTime(item.createdAt),
  };
}

export const adminUserService = {
  async getAll() {
    const response = await apiClient.get<AdminUserApiItem[]>(endpoints.adminUsers, {
      auth: true,
    });

    return response.map(toUser);
  },

  async create(user: AdminUser & { password?: string }) {
    const response = await apiClient.post<
      AdminUserApiItem,
      {
        username: string;
        password: string;
        fullName: string;
        email: string;
        phone: string;
        roles: AdminUserRole[];
      }
    >(
      endpoints.adminUsers,
      {
        username: user.username,
        password: user.password ?? "ChangeMe@123",
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
      },
      { auth: true },
    );

    return toUser(response);
  },

  async updateRoles(userId: string, roles: AdminUserRole[]) {
    const response = await apiClient.patch<
      AdminUserApiItem,
      { roles: AdminUserRole[] }
    >(endpoints.adminUserRoles(userId), { roles }, { auth: true });

    return toUser(response);
  },

  async updateStatus(userId: string, active: boolean) {
    const response = await apiClient.patch<AdminUserApiItem, { active: boolean }>(
      endpoints.adminUserStatus(userId),
      { active },
      { auth: true },
    );

    return toUser(response);
  },
};
