import { endpoints } from "@/services/endpoints";
import { apiClient } from "@/services/apiClient";
import type { CrimeType } from "@/features/report-submission/types/reportSubmission.types";

type CrimeTypeApiResponse = {
  id: number;
  code: string;
  name: string;
  description: string;
};

const presentationByCode: Record<
  string,
  Pick<CrimeType, "icon" | "tone">
> = {
  SOCIAL_ORDER: { icon: "users", tone: "green" },
  DRUG: { icon: "medical", tone: "orange" },
  ECONOMIC: { icon: "money", tone: "blue" },
  CYBER: { icon: "network", tone: "red" },
};

export const crimeTypeService = {
  getCrimeTypes: async () => {
    const crimeTypes = await apiClient.get<CrimeTypeApiResponse[]>(
      endpoints.crimeTypes,
    );

    return crimeTypes.map<CrimeType>((crimeType) => ({
      ...crimeType,
      id: String(crimeType.id),
      ...(presentationByCode[crimeType.code] ?? {
        icon: "users",
        tone: "gray",
      }),
    }));
  },
};
