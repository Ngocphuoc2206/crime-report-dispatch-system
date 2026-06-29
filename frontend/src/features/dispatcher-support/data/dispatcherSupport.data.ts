export const dispatcherGuides = [
  {
    title: "Quy trình điều phối tin báo mới",
    items: [
      "Kiểm tra mức độ nguy cấp và nội dung tin báo.",
      "Xác minh vị trí hiện trường trên bản đồ hoặc thông tin địa chỉ.",
      "Chọn đơn vị sẵn sàng, gần nhất và phù hợp nghiệp vụ.",
      "Ghi chú điều phối nếu có yêu cầu đặc biệt.",
      "Bấm điều phối và theo dõi phản hồi từ đơn vị.",
    ],
  },
  {
    title: "Khi đơn vị không phản hồi",
    items: [
      "Kiểm tra thời gian SLA còn lại.",
      "Liên hệ lại đơn vị đang được giao.",
      "Đổi đơn vị nếu quá thời gian phản hồi.",
      "Ghi rõ lý do đổi đơn vị để phục vụ kiểm toán hệ thống.",
    ],
  },
  {
    title: "Ý nghĩa trạng thái hồ sơ",
    items: [
      "Chờ điều phối: hồ sơ chưa được giao cho đơn vị.",
      "Đã điều phối: nhiệm vụ đã được gửi tới đơn vị.",
      "Đã tiếp nhận: đơn vị xác nhận xử lý.",
      "Tại hiện trường: đơn vị đã đến hoặc đang xử lý hiện trường.",
      "Đã xử lý: hồ sơ đã hoàn tất bước xử lý.",
    ],
  },
];

export const dispatcherFaqs = [
  {
    question: "Dispatcher có được sửa nội dung tin báo không?",
    answer:
      "Không nên sửa nội dung gốc của người dân. Dispatcher chỉ ghi chú điều phối hoặc bổ sung thông tin nghiệp vụ.",
  },
  {
    question: "Khi nào cần đổi đơn vị?",
    answer:
      "Khi đơn vị không phản hồi, quá SLA, đang bận vụ khẩn cấp khác hoặc không phù hợp khu vực xử lý.",
  },
  {
    question: "Tin báo khẩn cấp có cần điều phối ngay không?",
    answer:
      "Có. Tin báo khẩn cấp phải được ưu tiên xử lý trước và theo dõi sát thời gian phản hồi.",
  },
];
