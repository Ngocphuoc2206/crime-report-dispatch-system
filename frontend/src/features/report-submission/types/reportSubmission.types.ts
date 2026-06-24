// Step 1
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

// Step 2
export type ReporterMode = "anonymous" | "identified";

export type ReporterIdentityDraft = {
  mode: ReporterMode;
  fullName: string;
  citizenId: string;
  phone: string;
  email: string;
  address: string;
  privacyAccepted: boolean;
};

export type ReporterIdentityPayload = {
  reporterFullName: string | null;
  reporterCitizenId: string | null;
  reporterPhone: string | null;
  reporterEmail: string | null;
  reporterAddress: string | null;
};
