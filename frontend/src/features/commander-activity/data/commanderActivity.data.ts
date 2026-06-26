import type { CommanderActivityItem } from "@/features/commander-activity/types/commanderActivity.types";

export const commanderActivityItems: CommanderActivityItem[] = [
  {
    id: "activity-1",
    caseCode: "TB-2023-0891",
    title: "TB-2023-0891",
    description:
      "Hệ thống tự động ghi nhận tín hiệu cầu cứu khẩn cấp từ thiết bị đeo tay tại khu vực nhà xưởng A3.",
    type: "EMERGENCY_SIGNAL",
    priority: "HIGH",
    timeLabel: "14:32:45 - Hôm nay",
    occurredAt: "2023-10-24T14:32:45.000Z",
    actor: "Hệ thống tự động",
  },
  {
    id: "activity-2",
    caseCode: "TB-2023-0890",
    title: "TB-2023-0890",
    description:
      "Cán bộ Trần Văn B đã tiếp nhận hồ sơ. Đang di chuyển đến hiện trường kiểm tra rò rỉ hóa chất.",
    type: "CASE_ACCEPTED",
    priority: "MEDIUM",
    timeLabel: "14:15:22 - Hôm nay",
    occurredAt: "2023-10-24T14:15:22.000Z",
    actor: "Trần Văn B",
  },
  {
    id: "activity-3",
    caseCode: "TB-2023-0889",
    title: "TB-2023-0889",
    description:
      "Cập nhật hình ảnh hiện trường vụ va chạm. Đã yêu cầu thêm đội cứu thương hỗ trợ.",
    type: "STATUS_UPDATED",
    priority: "HIGH",
    timeLabel: "13:45:10 - Hôm nay",
    occurredAt: "2023-10-24T13:45:10.000Z",
    actor: "Đội xử lý hiện trường",
  },
  {
    id: "activity-4",
    caseCode: "TB-2023-0888",
    title: "TB-2023-0888",
    description:
      "Sự cố kẹt thang máy đã được giải quyết an toàn. Đã lập biên bản bàn giao cho bộ phận kỹ thuật bảo trì.",
    type: "CASE_COMPLETED",
    priority: "LOW",
    timeLabel: "11:20:05 - Hôm nay",
    occurredAt: "2023-10-24T11:20:05.000Z",
    actor: "Đội phản ứng nhanh",
  },
  {
    id: "activity-5",
    caseCode: "TB-2023-0887",
    title: "TB-2023-0887",
    description:
      "Báo cáo giả mạo từ hệ thống camera khu vực D. Đã đánh dấu và chặn nguồn cấp dữ liệu tạm thời.",
    type: "SPAM_BLOCKED",
    priority: "NONE",
    timeLabel: "10:05:12 - Hôm nay",
    occurredAt: "2023-10-24T10:05:12.000Z",
    actor: "AI Risk Engine",
  },
  {
    id: "activity-6",
    caseCode: "HS-2023-10-8472",
    title: "HS-2023-10-8472",
    description:
      "Hồ sơ có dấu hiệu sai lệch vị trí báo cáo và IP mạng. Hệ thống khuyến nghị chỉ huy xem xét trước khi đóng.",
    type: "STATUS_UPDATED",
    priority: "LOW",
    timeLabel: "09:30:18 - Hôm nay",
    occurredAt: "2023-10-24T09:30:18.000Z",
    actor: "Hệ thống phân tích rủi ro",
  },
];
