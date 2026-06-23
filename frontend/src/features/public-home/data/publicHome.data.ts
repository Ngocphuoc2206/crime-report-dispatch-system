import type {
  LegalHelpItem,
  SecurityAlert,
  TrustMetric,
} from "@/features/public-home/types/publicHome.types";

export const securityAlerts: SecurityAlert[] = [
  {
    id: "alert-1",
    level: "Khẩn cấp",
    title: "Cảnh báo lừa đảo chiếm đoạt tài sản qua mạng viễn thông",
    summary:
      "Cảnh báo thủ đoạn giả danh cán bộ cơ quan tư pháp gọi điện yêu cầu chuyển tiền vào tài khoản lạ.",
    time: "14:20",
    date: "24/10",
    tone: "danger",
  },
  {
    id: "alert-2",
    level: "Cảnh báo",
    title: "Phát hiện nhóm đối tượng nghi vấn trộm cắp tại Quận 1",
    summary:
      "Lực lượng chức năng tăng cường tuần tra tại khu vực trung tâm sau khi ghi nhận các hành vi nghi vấn.",
    time: "09:15",
    date: "24/10",
    tone: "warning",
  },
  {
    id: "alert-3",
    level: "Tin thường",
    title: "Thông báo diễn tập phòng cháy chữa cháy tại tòa nhà X",
    summary:
      "Người dân lưu ý lộ trình di chuyển xung quanh khu vực diễn tập để tránh ùn tắc giao thông.",
    time: "16:45",
    date: "23/10",
    tone: "info",
  },
  {
    id: "alert-4",
    level: "Cập nhật",
    title: "Đã xử lý dứt điểm ổ nhóm cờ bạc trái phép tại xã Y",
    summary:
      "Công an huyện phối hợp cùng lực lượng địa phương triệt phá thành công tụ điểm đánh bạc trái phép.",
    time: "08:00",
    date: "23/10",
    tone: "success",
  },
];

export const legalHelpItems: LegalHelpItem[] = [
  {
    id: "help-1",
    title: "Quy trình tố giác tội phạm",
    description: "Chi tiết các bước từ tiếp nhận đến phản hồi kết quả.",
    icon: "book",
  },
  {
    id: "help-2",
    title: "Luật An ninh mạng 2024",
    description: "Những quy định mới nhất về bảo vệ dữ liệu cá nhân.",
    icon: "shield-search",
  },
  {
    id: "help-3",
    title: "Quyền & Nghĩa vụ người dân",
    description: "Bảo mật thông tin người tố giác và hỗ trợ pháp lý.",
    icon: "shield",
  },
];

export const trustMetrics: TrustMetric[] = [
  {
    id: "metric-security",
    value: "100%",
    label: "Thông tin được bảo mật",
  },
  {
    id: "metric-time",
    value: "24/7",
    label: "Thời gian tiếp nhận",
  },
  {
    id: "metric-response",
    value: "15 phút",
    label: "Phản hồi khẩn cấp",
  },
];
