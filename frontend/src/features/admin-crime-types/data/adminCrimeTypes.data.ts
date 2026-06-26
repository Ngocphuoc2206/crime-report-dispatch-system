import type { AdminCrimeType } from "@/features/admin-crime-types/types/adminCrimeType.types";

export const adminCrimeTypes: AdminCrimeType[] = [
  {
    id: 1,
    code: "TC01",
    name: "Trộm cắp tài sản",
    description: "Hành vi lén lút chiếm đoạt tài sản của người khác.",
    categoryId: 10,
    baseScore: 50,
    status: "ACTIVE",
  },
  {
    id: 2,
    code: "CD01",
    name: "Cố ý gây thương tích",
    description: "Hành vi cố ý làm tổn hại đến sức khỏe của người khác.",
    categoryId: 20,
    baseScore: 80,
    status: "ACTIVE",
  },
  {
    id: 3,
    code: "MT01",
    name: "Tàng trữ trái phép ma túy",
    description: "Hành vi cất giữ bất hợp pháp chất ma túy ở bất kỳ nơi nào.",
    categoryId: 30,
    baseScore: 90,
    status: "INACTIVE",
  },
];
