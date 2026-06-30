export type AdminCrimeTypeStatus = "ACTIVE" | "INACTIVE";

export type AdminCrimeType = {
  id: number;
  code: string;
  name: string;
  description: string;
  categoryId: number;
  baseScore: number;
  status: AdminCrimeTypeStatus;
};
