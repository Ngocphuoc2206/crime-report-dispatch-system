import type {
  AdminAccountMetric,
  AdminRecentUser,
  AdminReportMetric,
} from "@/features/admin-dashboard/types/adminDashboard.types";

export const adminAccountMetrics: AdminAccountMetric[] = [
  {
    id: "total",
    label: "Tổng số",
    value: "124",
    tone: "default",
  },
  {
    id: "active",
    label: "Hoạt động",
    value: "120",
    tone: "success",
  },
  {
    id: "locked",
    label: "Bị khóa",
    value: "4",
    tone: "danger",
  },
  {
    id: "officer",
    label: "Officer",
    value: "85",
    tone: "officer",
  },
  {
    id: "dispatcher",
    label: "Dispatcher",
    value: "15",
    tone: "dispatcher",
  },
  {
    id: "commander",
    label: "Commander",
    value: "10",
    tone: "commander",
  },
  {
    id: "admin",
    label: "Admin",
    value: "14",
    tone: "admin",
  },
];

export const adminReportMetrics: AdminReportMetric[] = [
  {
    id: "total",
    label: "Tổng số",
    value: "1.248",
    description: "Cập nhật lúc 08:30 hôm nay",
    tone: "primary",
  },
  {
    id: "new",
    label: "Mới tiếp nhận",
    value: "342",
    tone: "default",
  },
  {
    id: "verifying",
    label: "Đang xác minh",
    value: "156",
    tone: "default",
  },
  {
    id: "transferred",
    label: "Đã chuyển điều tra",
    value: "89",
    tone: "default",
  },
  {
    id: "resolved",
    label: "Đã xử lý",
    value: "620",
    tone: "success",
  },
  {
    id: "emergency",
    label: "Khẩn cấp",
    value: "15",
    tone: "danger",
  },
];

export const adminRecentUsers: AdminRecentUser[] = [
  {
    id: "user-1",
    username: "officer_hcm_01",
    fullName: "Nguyễn Văn A",
    role: "Officer",
    status: "ACTIVE",
    createdAt: "20/10/2023",
  },
  {
    id: "user-2",
    username: "dispatcher_hn_05",
    fullName: "Trần Thị B",
    role: "Dispatcher",
    status: "ACTIVE",
    createdAt: "19/10/2023",
  },
  {
    id: "user-3",
    username: "commander_dn_02",
    fullName: "Lê Văn C",
    role: "Commander",
    status: "PENDING",
    createdAt: "18/10/2023",
  },
];
