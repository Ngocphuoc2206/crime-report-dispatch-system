export type CrimeTypeTone = "green" | "orange" | "blue" | "red" | "gray";

export type CrimeType = {
  id: string;
  code: string;
  name: string;
  description: string;
  icon?: string;
  tone?: CrimeTypeTone;
};

export type ReportClassificationDraft = {
  crimeTypeId: string;
  crimeTypeCode: string;
  crimeTypeName: string;
  anonymous: boolean;
};
