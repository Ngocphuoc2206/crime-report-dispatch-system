export type AdminUserRole = "OFFICER" | "DISPATCHER" | "COMMANDER" | "ADMIN";

export type AdminUserStatus = "ACTIVE" | "LOCKED" | "PENDING";

export type AdminUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  roles: AdminUserRole[];
  status: AdminUserStatus;
  createdAt: string;
};
