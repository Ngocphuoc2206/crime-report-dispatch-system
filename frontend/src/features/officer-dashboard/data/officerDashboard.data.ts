import type {
  ActivityLog,
  IntakeTrendPoint,
  OfficerMetric,
  PriorityCase,
  UnitStatus,
} from "@/features/officer-cases/types/officerDashboard.types";

export const officerMetrics: OfficerMetric[] = [
  {
    id: "total-reports",
    label: "Tổng tin báo",
    value: "142",
    description: "Tăng so với hôm qua",
    trend: "+12%",
    trendTone: "up",
  },
  {
    id: "pending",
    label: "Đang chờ xử lý",
    value: "28",
    description: "~ 15 phút phản hồi",
    trendTone: "neutral",
  },
  {
    id: "sla",
    label: "Tỷ lệ đúng hạn SLA",
    value: "94.5%",
    description: "Giảm nhẹ trong ngày",
    trend: "-0.5%",
    trendTone: "down",
  },
  {
    id: "online-officers",
    label: "Cán bộ trực tuyến",
    value: "45",
    description: "/ 50 tổng số",
    trendTone: "neutral",
  },
];

export const intakeTrendPoints: IntakeTrendPoint[] = [
  { time: "00:00", received: 12, processed: 10 },
  { time: "04:00", received: 16, processed: 12 },
  { time: "08:00", received: 9, processed: 7 },
  { time: "12:00", received: 28, processed: 20 },
  { time: "16:00", received: 32, processed: 26 },
  { time: "20:00", received: 25, processed: 15 },
  { time: "24:00", received: 38, processed: 34 },
];

export const priorityCases: PriorityCase[] = [
  {
    id: "priority-1",
    code: "HS-2310-045",
    title: "Bạo lực gia đình nghiêm trọng",
    description: "Báo cáo tại khu vực Phường 5, có hung khí.",
    timeLabel: "2 phút trước",
    level: "urgent",
  },
  {
    id: "priority-2",
    code: "HS-2310-042",
    title: "Tai nạn giao thông liên hoàn",
    description: "Cản trở giao thông nghiêm trọng tại QL1A.",
    timeLabel: "15 phút trước",
    level: "urgent",
  },
  {
    id: "priority-3",
    code: "HS-2310-038",
    title: "Gây rối trật tự công cộng",
    description: "Nhóm đông người tại cổng chợ Trung Tâm.",
    timeLabel: "45 phút trước",
    level: "high",
  },
];

export const unitStatuses: UnitStatus[] = [
  {
    id: "unit-1",
    unitName: "Phòng PC02",
    current: 12,
    total: 15,
    tone: "navy",
  },
  {
    id: "unit-2",
    unitName: "Đội 7 (CSGT)",
    current: 5,
    total: 8,
    tone: "blue",
  },
  {
    id: "unit-3",
    unitName: "Công an Phường 1",
    current: 3,
    total: 10,
    tone: "green",
  },
];

export const activityLogs: ActivityLog[] = [
  {
    id: "log-1",
    time: "08:25 AM",
    caseCode: "HS-2310-044",
    action: "Tiếp nhận tin báo mới qua Hotline",
    actor: "Hệ thống tổng đài",
    status: "received",
  },
  {
    id: "log-2",
    time: "08:15 AM",
    caseCode: "HS-2310-040",
    action: "Chuyển xử lý cho Phòng PC02",
    actor: "Nguyễn Văn A",
    status: "verifying",
  },
  {
    id: "log-3",
    time: "07:50 AM",
    caseCode: "HS-2310-035",
    action: "Cập nhật kết quả hiện trường",
    actor: "Lê Thị B",
    status: "resolved",
  },
];
