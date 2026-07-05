export type AdminOfficerStatus = "ACTIVE" | "SUSPENDED";

export type AdminOfficerRank =
  | "Thiếu úy"
  | "Trung úy"
  | "Thượng úy"
  | "Đại úy"
  | "Thiếu tá"
  | "Trung tá"
  | "Điều tra viên cao cấp";

export type AdminOfficerUserOption = {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
};

export type AdminOfficerRecentCase = {
  code: string;
  title: string;
  status: "COMPLETED" | "PROCESSING";
  updatedAt: string;
};

export type AdminOfficerProfile = {
  id: string;
  userId: string;
  officerId: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  badgeNumber: string;
  rank: AdminOfficerRank;
  unitId: string;
  unitName: string;
  joinedAt: string;
  status: AdminOfficerStatus;
  avatarUrl?: string;
  performance: {
    processedCases: number;
    slaRate: string;
    rating: string;
  };
  recentCases: AdminOfficerRecentCase[];
};
