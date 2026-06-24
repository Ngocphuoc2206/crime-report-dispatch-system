import type { SupportNotification } from "@/features/support/types/support.types";

export const supportNotifications: SupportNotification[] = [
  {
    id: "notification-additional-evidence",
    title: "Yêu cầu bổ sung bằng chứng - Vụ việc #10294",
    description:
      "Vui lòng cung cấp thêm hình ảnh hoặc video liên quan đến vụ việc mất trộm tài sản tại Quận 1 để phục vụ công tác điều tra.",
    timeLabel: "10 phút trước",
    tone: "urgent",
    statusLabel: "Khẩn cấp",
    actionLabel: "Bổ sung ngay",
    actionHref: "/tracking/TTP-2024-0812/additional-evidence",
  },
  {
    id: "notification-received",
    title: "Hồ sơ đã được tiếp nhận",
    description:
      "Tin báo về hành vi gây rối trật tự công cộng của bạn đã được chuyển tới đơn vị chức năng thụ lý giải quyết.",
    timeLabel: "2 giờ trước",
    tone: "info",
    statusLabel: "Quan trọng",
    actionLabel: "Xem hồ sơ",
    actionHref: "/tracking/TTP-2024-0755",
  },
  {
    id: "notification-resolved",
    title: "Xử lý hoàn tất hồ sơ #09882",
    description:
      "Hồ sơ phản ánh về trật tự giao thông đã được xử lý. Kết quả chi tiết đã được cập nhật trong trang tra cứu.",
    timeLabel: "Hôm qua",
    tone: "success",
    statusLabel: "Thành công",
    actionLabel: "Xem kết quả",
    actionHref: "/tracking/TTP-2024-0422",
  },
  {
    id: "notification-verify-identity",
    title: "Xác minh danh tính yêu cầu",
    description:
      "Để đảm bảo tính bảo mật, vui lòng thực hiện xác minh danh tính qua VNeID để tiếp tục theo dõi tiến độ vụ việc.",
    timeLabel: "2 ngày trước",
    tone: "pending",
    statusLabel: "Đang chờ",
    actionLabel: "Xem hướng dẫn",
    actionHref: "/support",
  },
];
