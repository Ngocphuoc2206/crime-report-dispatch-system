import type { OfficerCase } from "@/features/officer-cases/types/officerCase.types";

export const CURRENT_OFFICER_ID = "internal-user-001";
export const CURRENT_OFFICER_NAME = "Nguyễn Văn Trực Ban";

export const mockOfficerCases: OfficerCase[] = [
  {
    code: "TB-2023-0842",
    title: "Tụ tập đông người gây rối trật tự công cộng",
    summary:
      "Tụ tập đông người gây rối trật tự công cộng, mang theo hung khí tại khu vực ngã tư.",
    category: "Trật tự xã hội",
    location: "Ngã tư Trần Phú, Quận H",
    priority: "URGENT",
    status: "NEW",
    submittedAt: "2026-06-23T08:25:00.000Z",
    reporterMode: "anonymous",
    anonymousTemporaryId: "USR-ANON-849X",
    incident: {
      description:
        "Vào lúc 14h15, tôi quan sát thấy một nhóm khoảng 5-6 thanh niên xăm trổ, đi trên 3 xe máy không rõ biển số tụ tập tại cuối hẻm 42. Có ít nhất 2 người mang theo bao tải dài nghi là mã tấu.",
      timeText: "Khoảng 14:15 ngày 23/06/2026",
      address: "Hẻm 42, đường Nguyễn Văn Cừ, Quận 1",
      latitude: "10.7589",
      longitude: "106.6823",
    },
    evidence: [
      {
        id: "evidence-1",
        name: "IMG_20240623_1412.jpg",
        type: "image",
        size: "2.4 MB",
        uploadedAt: "2026-06-23T08:25:00.000Z",
      },
      {
        id: "evidence-2",
        name: "VID_20240623_ghi_am.mp4",
        type: "video",
        size: "15.2 MB",
        uploadedAt: "2026-06-23T08:26:00.000Z",
      },
    ],
    timeline: [
      {
        id: "timeline-1",
        title: "Tiếp nhận tin báo",
        description: "Hệ thống ghi nhận tin báo từ cổng công dân.",
        actor: "Hệ thống",
        occurredAt: "2026-06-23T08:25:00.000Z",
      },
    ],
  },
  {
    code: "TIN-2023-11-28-0982",
    title: "Lừa đảo chiếm đoạt tài sản qua mạng",
    summary:
      "Giả danh ngân hàng, yêu cầu người dân nhập OTP và chiếm đoạt tiền trong tài khoản.",
    category: "Không gian mạng",
    location: "Phường Láng Hạ, Quận Đống Đa, Hà Nội",
    priority: "HIGH",
    status: "VERIFYING",
    submittedAt: "2026-06-23T09:45:00.000Z",
    assignedOfficerName: CURRENT_OFFICER_NAME,
    reporterMode: "identified",
    reporter: {
      fullName: "Nguyễn Văn An",
      citizenId: "001092038475",
      phone: "0987654321",
      address: "Phường Láng Hạ, Quận Đống Đa, TP. Hà Nội",
    },
    lock: {
      lockedById: CURRENT_OFFICER_ID,
      lockedByName: CURRENT_OFFICER_NAME,
      expiresAt: new Date(Date.now() + 29 * 60 * 1000).toISOString(),
    },
    incident: {
      description:
        "Vào khoảng 09:30 sáng ngày 28/11/2023, tôi nhận được một cuộc gọi từ số điện thoại lạ tự xưng là nhân viên bảo mật của Ngân hàng VCB. Đối tượng thông báo tài khoản của tôi đang bị nghi ngờ giao dịch bất thường và yêu cầu truy cập vào đường link giả mạo để xác thực. Sau khi nhập thông tin đăng nhập và mã OTP, tôi nhận được tin báo trừ tiền liên tục 3 lần.",
      timeText: "Khoảng 09:30 ngày 28/11/2023",
      address: "Phường Láng Hạ, Quận Đống Đa, TP. Hà Nội",
      estimatedDamage: "50,000,000 VNĐ",
      relatedBank: "Vietcombank",
    },
    evidence: [
      {
        id: "evidence-3",
        name: "screenshot_link_gia_mao.png",
        type: "image",
        size: "1.8 MB",
        uploadedAt: "2026-06-23T09:46:00.000Z",
      },
      {
        id: "evidence-4",
        name: "sms_tru_tien.jpg",
        type: "image",
        size: "1.1 MB",
        uploadedAt: "2026-06-23T09:47:00.000Z",
      },
    ],
    timeline: [
      {
        id: "timeline-1",
        title: "Tiếp nhận hồ sơ",
        description: "Hệ thống ghi nhận hồ sơ trực tuyến.",
        actor: "Hệ thống",
        occurredAt: "2026-06-23T09:45:00.000Z",
      },
      {
        id: "timeline-2",
        title: "Phân công xử lý",
        description: "Hồ sơ được giao cho cán bộ trực ban.",
        actor: CURRENT_OFFICER_NAME,
        occurredAt: "2026-06-23T10:00:00.000Z",
      },
    ],
  },
  {
    code: "HS-2023-11-0891",
    title: "Trộm cắp tài sản tại cửa hàng",
    summary:
      "Phát hiện cửa cuốn bị phá khóa, mất tài sản trong cửa hàng. Hồ sơ đang được cán bộ khác xử lý.",
    category: "Trộm cắp tài sản",
    location: "123 Đường Nguyễn Trãi, Quận 1",
    priority: "MEDIUM",
    status: "VERIFYING",
    submittedAt: "2026-06-22T08:30:00.000Z",
    assignedOfficerName: "Đại úy Nguyễn Văn A",
    reporterMode: "identified",
    reporter: {
      fullName: "Trần Thị B",
      citizenId: "001192837465",
      phone: "0987654321",
      address:
        "123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    },
    lock: {
      lockedById: "other-officer-001",
      lockedByName: "Đại úy Nguyễn Văn A",
      expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    },
    incident: {
      description:
        "Phát hiện cửa cuốn bị phá khóa bằng kìm cộng lực. Kẻ gian đột nhập lấy đi 02 máy tính xách tay nhãn hiệu Dell, 01 điện thoại iPhone 14 Pro Max và khoảng 15 triệu đồng tiền mặt.",
      timeText: "Khoảng 02:00 ngày 15/11/2023",
      address: "123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1",
    },
    evidence: [
      {
        id: "evidence-5",
        name: "Camera_an_ninh_01.jpg",
        type: "image",
        size: "5.1 MB",
        uploadedAt: "2026-06-22T08:40:00.000Z",
      },
    ],
    timeline: [
      {
        id: "timeline-1",
        title: "Tiếp nhận hồ sơ",
        description: "Hệ thống ghi nhận hồ sơ trực tuyến.",
        actor: "Hệ thống",
        occurredAt: "2026-06-22T08:30:00.000Z",
      },
      {
        id: "timeline-2",
        title: "Đang xác minh thông tin",
        description: "Đại úy Nguyễn Văn A đang xử lý.",
        actor: "Đại úy Nguyễn Văn A",
        occurredAt: "2026-06-22T09:45:00.000Z",
      },
    ],
  },
  {
    code: "HS-2023-10-0891",
    title: "Gây rối trật tự công cộng",
    summary:
      "Nhóm thanh niên gây rối tại quán ăn đêm. Hồ sơ đã kết thúc xử lý.",
    category: "Gây rối trật tự công cộng",
    location: "123 Đường Nguyễn Trãi, Quận 1",
    priority: "MEDIUM",
    status: "CLOSED",
    submittedAt: "2026-06-20T22:30:00.000Z",
    reporterMode: "identified",
    reporter: {
      fullName: "Trần Văn Bình",
      citizenId: "Ẩn theo chính sách",
      phone: "0901***888",
      address: "Không hiển thị",
    },
    incident: {
      description:
        "Nhóm khoảng 4-5 thanh niên có biểu hiện say xỉn, cự cãi và xô xát tại quán ăn đêm. Gây hư hỏng một số tài sản của quán và làm mất trật tự khu vực.",
      timeText: "10/10/2023 - 22:15",
      address: "123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1",
    },
    evidence: [
      {
        id: "evidence-6",
        name: "hientruong_01.jpg",
        type: "image",
        size: "2.4 MB",
        uploadedAt: "2026-06-20T22:40:00.000Z",
      },
      {
        id: "evidence-7",
        name: "bien_ban_loi_khai.pdf",
        type: "pdf",
        size: "1.1 MB",
        uploadedAt: "2026-06-21T09:15:00.000Z",
      },
    ],
    timeline: [
      {
        id: "timeline-1",
        title: "Tiếp nhận tin báo",
        description: "Ghi nhận thông tin từ tổng đài 113.",
        actor: "Hệ thống",
        occurredAt: "2026-06-20T22:30:00.000Z",
      },
      {
        id: "timeline-2",
        title: "Phân công thụ lý",
        description: "Hồ sơ được giao cho đội điều tra tổng hợp.",
        actor: "Trực ban chỉ huy",
        occurredAt: "2026-06-21T08:00:00.000Z",
      },
      {
        id: "timeline-3",
        title: "Kết thúc hồ sơ",
        description: "Kết luận xử phạt hành chính các đối tượng vi phạm.",
        actor: "Thiếu tá Nguyễn Văn A",
        occurredAt: "2026-06-23T14:30:00.000Z",
      },
    ],
  },
  {
    code: "TB-2023-0891",
    title: "Nghi ngờ tổ chức đánh bạc qua mạng quy mô lớn",
    summary:
      "Nghi ngờ tổ chức đánh bạc qua mạng quy mô lớn tại khu vực quận Gò Vấp. Đã có dấu hiệu giao dịch bất thường.",
    category: "Không gian mạng",
    location: "Quận Gò Vấp, TP. Hồ Chí Minh",
    priority: "URGENT",
    status: "VERIFYING",
    submittedAt: "2026-06-24T10:45:00.000Z",
    assignedOfficerName: CURRENT_OFFICER_NAME,
    reporterMode: "identified",
    reporter: {
      fullName: "Phạm Văn C",
      citizenId: "001234567890",
      phone: "0909123456",
      address: "Quận Gò Vấp, TP. Hồ Chí Minh",
    },
    lock: {
      lockedById: CURRENT_OFFICER_ID,
      lockedByName: CURRENT_OFFICER_NAME,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
    incident: {
      description:
        "Người dân phản ánh có một nhóm đối tượng sử dụng mạng xã hội để tổ chức đánh bạc trực tuyến, giao dịch qua nhiều tài khoản ngân hàng khác nhau. Hoạt động diễn ra thường xuyên vào ban đêm.",
      timeText: "10:45 - 24/10/2023",
      address: "Quận Gò Vấp, TP. Hồ Chí Minh",
      estimatedDamage: "Chưa xác định",
    },
    evidence: [
      {
        id: "evidence-my-1",
        name: "anh_chup_giao_dich.jpg",
        type: "image",
        size: "2.2 MB",
        uploadedAt: "2026-06-24T10:46:00.000Z",
      },
    ],
    timeline: [
      {
        id: "timeline-my-1",
        title: "Tiếp nhận hồ sơ",
        description: "Hồ sơ được tiếp nhận từ cổng công dân.",
        actor: "Hệ thống",
        occurredAt: "2026-06-24T10:45:00.000Z",
      },
      {
        id: "timeline-my-2",
        title: "Cán bộ nhận xử lý",
        description: "Hồ sơ được khóa cho cán bộ trực ban.",
        actor: CURRENT_OFFICER_NAME,
        occurredAt: "2026-06-24T10:50:00.000Z",
      },
    ],
  },
  {
    code: "TB-2023-0895",
    title: "Phản ánh tiếng ồn sau 22h tại cơ sở kinh doanh",
    summary:
      "Cơ sở kinh doanh XYZ liên tục gây tiếng ồn vào ban đêm. Cần kiểm tra và xác minh phản ánh.",
    category: "Trật tự đô thị",
    location: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    priority: "MEDIUM",
    status: "VERIFYING",
    submittedAt: "2026-06-24T08:15:00.000Z",
    assignedOfficerName: CURRENT_OFFICER_NAME,
    reporterMode: "identified",
    reporter: {
      fullName: "Lê Thị D",
      citizenId: "001987654321",
      phone: "0911222333",
      address: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
    lock: {
      lockedById: CURRENT_OFFICER_ID,
      lockedByName: CURRENT_OFFICER_NAME,
      expiresAt: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
    },
    incident: {
      description:
        "Người dân phản ánh cơ sở kinh doanh XYZ thường xuyên mở nhạc lớn sau 22h, ảnh hưởng đến sinh hoạt của khu dân cư. Tình trạng đã kéo dài nhiều ngày.",
      timeText: "08:15 - 24/10/2023",
      address: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
    evidence: [],
    timeline: [
      {
        id: "timeline-my-3",
        title: "Tiếp nhận hồ sơ",
        description: "Hồ sơ được ghi nhận từ phản ánh trực tuyến.",
        actor: "Hệ thống",
        occurredAt: "2026-06-24T08:15:00.000Z",
      },
      {
        id: "timeline-my-4",
        title: "Đang xác minh",
        description: "Cán bộ đang kiểm tra thông tin phản ánh.",
        actor: CURRENT_OFFICER_NAME,
        occurredAt: "2026-06-24T08:30:00.000Z",
      },
    ],
  },
  {
    code: "TB-2023-0870",
    title: "Tranh chấp đất đai tại phường Tân Định",
    summary:
      "Tranh chấp đất đai có biểu hiện xô xát nhẹ. Yêu cầu công an phường kiểm tra thêm thông tin.",
    category: "Tranh chấp dân sự",
    location: "Phường Tân Định, Quận 1",
    priority: "MEDIUM",
    status: "NEEDS_ADDITIONAL_EVIDENCE",
    submittedAt: "2026-06-23T14:30:00.000Z",
    assignedOfficerName: CURRENT_OFFICER_NAME,
    reporterMode: "identified",
    reporter: {
      fullName: "Hoàng Văn E",
      citizenId: "001111222333",
      phone: "0988111222",
      address: "Phường Tân Định, Quận 1",
    },
    incident: {
      description:
        "Người trình báo phản ánh có tranh chấp đất đai giữa hai hộ dân. Hai bên lời qua tiếng lại, có dấu hiệu xô xát nhẹ. Cần bổ sung giấy tờ liên quan đến quyền sử dụng đất.",
      timeText: "14:30 - 23/10/2023",
      address: "Phường Tân Định, Quận 1",
    },
    evidence: [
      {
        id: "evidence-my-5",
        name: "anh_hien_truong.jpg",
        type: "image",
        size: "1.7 MB",
        uploadedAt: "2026-06-23T14:40:00.000Z",
      },
    ],
    timeline: [
      {
        id: "timeline-my-5",
        title: "Tiếp nhận hồ sơ",
        description: "Hồ sơ được tiếp nhận từ cổng công dân.",
        actor: "Hệ thống",
        occurredAt: "2026-06-23T14:30:00.000Z",
      },
      {
        id: "timeline-my-6",
        title: "Yêu cầu bổ sung tài liệu",
        description:
          "Cán bộ yêu cầu người dân bổ sung giấy tờ hoặc hình ảnh liên quan.",
        actor: CURRENT_OFFICER_NAME,
        occurredAt: "2026-06-23T15:00:00.000Z",
      },
    ],
  },
];
