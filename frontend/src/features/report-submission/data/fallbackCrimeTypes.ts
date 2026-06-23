import type { CrimeType } from "@/features/report-submission/types/reportSubmission.types";

export const fallbackCrimeTypes: CrimeType[] = [
  {
    id: "social-order",
    code: "SOCIAL_ORDER",
    name: "Trật tự xã hội",
    description:
      "Cướp giật, trộm cắp, gây rối trật tự công cộng, đánh nhau, hủy hoại tài sản hoặc xâm phạm thân thể người khác.",
    icon: "users",
    tone: "green",
  },
  {
    id: "drug",
    code: "DRUG",
    name: "Ma túy",
    description:
      "Tàng trữ, vận chuyển, buôn bán trái phép chất ma túy hoặc tổ chức sử dụng chất ma túy tại khu vực cư trú.",
    icon: "medical",
    tone: "orange",
  },
  {
    id: "economic",
    code: "ECONOMIC",
    name: "Kinh tế",
    description:
      "Buôn lậu, hàng giả, gian lận thương mại, tham nhũng hoặc các hành vi vi phạm quy định về quản lý kinh tế.",
    icon: "money",
    tone: "blue",
  },
  {
    id: "cyber",
    code: "CYBER",
    name: "Không gian mạng",
    description:
      "Lừa đảo qua mạng, đánh bạc trực tuyến, phát tán văn hóa phẩm độc hại hoặc tấn công hệ thống thông tin.",
    icon: "network",
    tone: "red",
  },
];
