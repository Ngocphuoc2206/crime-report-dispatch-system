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

// Step 3
export type IncidentInformationDraft = {
  description: string;
  incidentTime: string;
  timeUnknown: boolean;
  address: string;
  latitude: string;
  longitude: string;
  estimatedCrimeType: string;
  isHappeningNow: boolean;
  hasWeapon: boolean;
  hasInjured: boolean;
  tags: string[];
};

export type IncidentInformationPayload = {
  description: string;
  incidentTime: string | null;
  isHappeningNow: boolean;
  hasWeapon: boolean;
  hasInjuredPerson: boolean;
  latitude: number;
  longitude: number;
  addressText: string;
};

export type CreateReportPayload = IncidentInformationPayload &
  ReporterIdentityPayload & {
    crimeTypeId: number;
  };

// Step 4

export type EvidenceFileKind = "image" | "video" | "audio";

export type EvidenceUploadStatus =
  | "pending"
  | "uploading"
  | "uploaded"
  | "failed";

export type EvidenceFileDraft = {
  id: string;
  name: string;
  size: number;
  type: string;
  kind: EvidenceFileKind;
  progress: number;
  status: EvidenceUploadStatus;
  error?: string;
};

export type EvidenceUploadDraft = {
  files: EvidenceFileDraft[];
};
