import type { AdminUrgencyRule } from "@/features/admin-urgency-rules/types/adminUrgencyRule.types";

export const adminUrgencyRulesData: AdminUrgencyRule[] = [
  {
    id: 1,
    ruleCode: "RULE_WEAPON",
    title: "Có sử dụng vũ khí nóng",
    description:
      "Đối tượng nghi phạm có sử dụng vũ khí nóng (súng, dao găm, chất nổ)",
    scoreDelta: 50,
    status: "ACTIVE",
  },
  {
    id: 2,
    ruleCode: "RULE_IN_PROGRESS",
    title: "Sự việc đang diễn ra",
    description:
      "Sự việc đang diễn ra tại thời điểm báo tin, cần can thiệp ngay lập tức",
    scoreDelta: 30,
    status: "ACTIVE",
  },
  {
    id: 3,
    ruleCode: "RULE_INJURY",
    title: "Có người bị thương",
    description:
      "Có ghi nhận nạn nhân bị thương cần cấp cứu hoặc hỗ trợ y tế khẩn",
    scoreDelta: 40,
    status: "ACTIVE",
  },
  {
    id: 4,
    ruleCode: "RULE_VIDEO_EVIDENCE",
    title: "Có video chứng cứ",
    description: "Tin báo có kèm theo video/hình ảnh rõ nét làm bằng chứng",
    scoreDelta: 10,
    status: "INACTIVE",
  },
];
