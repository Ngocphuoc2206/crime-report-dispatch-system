import type {
  DispatchActivity,
  DispatchMetric,
  DispatchOfficerUnit,
  DispatchPriorityCase,
} from "@/features/dispatcher-dashboard/types/dispatcherDashboard.types";

export const dispatcherMetrics: DispatchMetric[] = [
  {
    id: "waiting",
    label: "Tin chờ điều phối",
    value: "24",
    description: "+3 tin trong 1 giờ qua",
    tone: "default",
  },
  {
    id: "critical",
    label: "Vụ việc khẩn cấp",
    value: "5",
    description: "Cần điều phối ngay",
    tone: "danger",
  },
  {
    id: "available",
    label: "Cán bộ sẵn sàng",
    value: "12 / 45",
    description: "Sẵn sàng trên các khu vực",
    tone: "success",
  },
  {
    id: "avg-time",
    label: "Thời gian điều phối TB",
    value: "2m 45s",
    description: "Nhanh hơn 15s so với TB",
    tone: "success",
  },
  {
    id: "blocked",
    label: "Tin chưa có đơn vị",
    value: "8",
    description: "Do thiếu cán bộ phù hợp",
    tone: "warning",
  },
];

export const dispatcherPriorityCases: DispatchPriorityCase[] = [
  {
    id: "case-1",
    caseCode: "INC-9021",
    type: "Tai nạn giao thông nghiêm trọng",
    priority: "CRITICAL",
    location: "Ngã 4 Nguyễn Trãi - Khuất Duy Tiến",
    createdAt: "14:30",
    waitingTime: "2 phút",
  },
  {
    id: "case-2",
    caseCode: "INC-9020",
    type: "Gây rối trật tự",
    priority: "CRITICAL",
    location: "Quán Bar XYZ, Q. Hoàn Kiếm",
    createdAt: "14:28",
    waitingTime: "4 phút",
  },
  {
    id: "case-3",
    caseCode: "INC-9019",
    type: "Trộm cắp tài sản",
    priority: "HIGH",
    location: "Khu dân cư A, Q. Cầu Giấy",
    createdAt: "14:15",
    waitingTime: "17 phút",
  },
  {
    id: "case-4",
    caseCode: "INC-9018",
    type: "Va chạm giao thông nhẹ",
    priority: "MEDIUM",
    location: "Cầu vượt Thái Hà",
    createdAt: "14:05",
    waitingTime: "27 phút",
  },
];

export const dispatcherOfficerUnits: DispatchOfficerUnit[] = [
  {
    id: "unit-102",
    unitCode: "Unit 102",
    name: "Tổ tuần tra khu vực A",
    zone: "Khu vực A",
    role: "Tuần tra",
    status: "AVAILABLE",
    distanceToCenter: "2 phút tới hiện trường",
  },
  {
    id: "unit-204",
    unitCode: "Unit 204",
    name: "Đội can thiệp nhanh",
    zone: "Khu vực B",
    role: "Can thiệp",
    status: "BUSY",
    currentCaseCode: "INC-8992",
    distanceToCenter: "Đang xử lý",
  },
  {
    id: "unit-115",
    unitCode: "Unit 115",
    name: "Tổ CSGT khu vực A",
    zone: "Khu vực A",
    role: "Giao thông",
    status: "AVAILABLE",
    distanceToCenter: "5 phút tới hiện trường",
  },
  {
    id: "unit-301",
    unitCode: "Unit 301",
    name: "Tổ chiến thuật khu vực C",
    zone: "Khu vực C",
    role: "Chiến thuật",
    status: "OFFLINE",
    distanceToCenter: "Nghỉ ca",
  },
  {
    id: "unit-402",
    unitCode: "Unit 402",
    name: "Tổ tuần tra khu vực D",
    zone: "Khu vực D",
    role: "Tuần tra",
    status: "AVAILABLE",
    distanceToCenter: "12 phút tới hiện trường",
  },
];

export const dispatcherActivities: DispatchActivity[] = [
  {
    id: "act-1",
    title: "Unit 405 đã được điều phối tới INC-9017",
    description: "Tổ phản ứng nhanh nhận nhiệm vụ.",
    time: "Vừa xong",
    tone: "danger",
  },
  {
    id: "act-2",
    title: "INC-9012 đã được Unit 112 xử lý",
    description: "Hồ sơ chuyển sang trạng thái đã giải quyết.",
    time: "5 phút trước",
    tone: "success",
  },
  {
    id: "act-3",
    title: "Tin khẩn cấp INC-9021 vừa được tạo",
    description: "Đang chờ điều phối cán bộ gần nhất.",
    time: "12 phút trước",
    tone: "warning",
  },
];
