import type {
  CommanderActivity,
  CommanderReportStatus,
  CommanderRiskLevel,
  CommanderUrgentCase,
} from "@/features/commander-dashboard/types/commanderDashboard.types";

export const commanderReportStatuses: CommanderReportStatus[] = [
  {
    id: "total",
    label: "Tổng số",
    value: "1,248",
    tone: "total",
  },
  {
    id: "new",
    label: "Mới tiếp nhận",
    value: "342",
    tone: "new",
  },
  {
    id: "verifying",
    label: "Đang xác minh",
    value: "156",
    tone: "verifying",
  },
  {
    id: "investigating",
    label: "Đang điều tra",
    value: "89",
    tone: "investigating",
  },
  {
    id: "resolved",
    label: "Đã xử lý",
    value: "620",
    tone: "resolved",
  },
  {
    id: "spam",
    label: "Giả / Spam",
    value: "41",
    tone: "spam",
  },
];

export const commanderRiskLevels: CommanderRiskLevel[] = [
  {
    label: "Khẩn cấp",
    percent: 15,
    count: 187,
    tone: "urgent",
  },
  {
    label: "Cao",
    percent: 25,
    count: 312,
    tone: "high",
  },
  {
    label: "Trung bình",
    percent: 40,
    count: 499,
    tone: "medium",
  },
  {
    label: "Thấp",
    percent: 20,
    count: 250,
    tone: "low",
  },
];

export const commanderUrgentCases: CommanderUrgentCase[] = [
  {
    id: "urgent-1",
    code: "TB-9921",
    category: "Tụ tập đông người gây rối",
    location: "Quận 1, TP.HCM",
    status: "Mới tiếp nhận",
    timeLabel: "2 phút trước",
  },
  {
    id: "urgent-2",
    code: "TB-9918",
    category: "Tai nạn giao thông nghiêm trọng",
    location: "Quốc lộ 1A, Bình Chánh",
    status: "Đang xác minh",
    timeLabel: "15 phút trước",
  },
  {
    id: "urgent-3",
    code: "TB-9915",
    category: "Cướp giật tài sản",
    location: "Quận 3, TP.HCM",
    status: "Điều tra",
    timeLabel: "42 phút trước",
  },
  {
    id: "urgent-4",
    code: "TB-9902",
    category: "Cháy nổ chung cư",
    location: "KĐT Linh Đàm, Hà Nội",
    status: "Đang xác minh",
    timeLabel: "1 giờ trước",
  },
  {
    id: "urgent-5",
    code: "TB-9890",
    category: "Bạo hành trẻ em",
    location: "Quận Thanh Xuân, Hà Nội",
    status: "Điều tra",
    timeLabel: "3 giờ trước",
  },
];

export const commanderActivities: CommanderActivity[] = [
  {
    id: "activity-1",
    title: "Đ/c Lê Trọng Tấn",
    description: "bức phản ánh vụ bạo lực tại TB-9915.",
    timeLabel: "10 phút trước",
    tone: "new",
  },
  {
    id: "activity-2",
    title: "Xác minh hoàn tất",
    description: "TB-9910. Nâng mức bị lên Cao.",
    timeLabel: "25 phút trước",
    tone: "verified",
  },
  {
    id: "activity-3",
    title: "Hệ thống tự động",
    description: "gắn dấu TB-9908 là Spam.",
    timeLabel: "40 phút trước",
    tone: "spam",
  },
  {
    id: "activity-4",
    title: "Báo cáo tổng hợp",
    description: "ca sáng đã được xuất bởi Trực ban 01.",
    timeLabel: "1 giờ trước",
    tone: "report",
  },
  {
    id: "activity-5",
    title: "Phát lệnh báo động",
    description: "toàn hệ thống khu vực Quân khu 7.",
    timeLabel: "2 giờ trước",
    tone: "broadcast",
  },
];
