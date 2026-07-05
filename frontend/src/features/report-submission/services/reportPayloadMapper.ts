import type {
  CreateReportPayload,
  IncidentInformationDraft,
  IncidentInformationPayload,
  ReportClassificationDraft,
  ReporterIdentityDraft,
  ReporterIdentityPayload,
} from "@/features/report-submission/types/reportSubmission.types";

function parseCoordinate(
  value: string,
  fieldName: "latitude" | "longitude",
): number {
  const coordinate = Number(value.trim());
  const [minimum, maximum] =
    fieldName === "latitude" ? [-90, 90] : [-180, 180];

  if (!value.trim() || !Number.isFinite(coordinate)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  if (coordinate < minimum || coordinate > maximum) {
    throw new Error(`${fieldName} must be between ${minimum} and ${maximum}`);
  }

  return coordinate;
}

export function toReporterIdentityPayload(
  draft: ReporterIdentityDraft,
): ReporterIdentityPayload {
  if (draft.mode === "anonymous") {
    return {
      reporterFullName: null,
      reporterCitizenId: null,
      reporterPhone: null,
      reporterEmail: null,
      reporterAddress: null,
    };
  }

  return {
    reporterFullName: draft.fullName.trim() || null,
    reporterCitizenId: draft.citizenId.trim() || null,
    reporterPhone: draft.phone.trim() || null,
    reporterEmail: draft.email.trim() || null,
    reporterAddress: draft.address.trim() || null,
  };
}

export function toIncidentInformationPayload(
  draft: IncidentInformationDraft,
): IncidentInformationPayload {
  const description = draft.description.trim();
  const addressText = draft.address.trim();

  if (!description) {
    throw new Error("description is required");
  }

  if (!addressText) {
    throw new Error("addressText is required");
  }

  return {
    description,
    incidentTime: draft.timeUnknown ? null : draft.incidentTime || null,
    isHappeningNow: draft.isHappeningNow,
    hasWeapon: draft.hasWeapon,
    hasInjuredPerson: draft.hasInjured,
    latitude: parseCoordinate(draft.latitude, "latitude"),
    longitude: parseCoordinate(draft.longitude, "longitude"),
    addressText,
  };
}

export function toCreateReportPayload(
  classification: ReportClassificationDraft,
  reporter: ReporterIdentityDraft,
  incident: IncidentInformationDraft,
): CreateReportPayload {
  const crimeTypeId = Number(classification.crimeTypeId);

  if (!Number.isSafeInteger(crimeTypeId) || crimeTypeId <= 0) {
    throw new Error("crimeTypeId must be a positive integer");
  }

  return {
    crimeTypeId,
    ...toIncidentInformationPayload(incident),
    ...toReporterIdentityPayload(reporter),
  };
}
