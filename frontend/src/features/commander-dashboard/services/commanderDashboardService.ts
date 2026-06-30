import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";
import type {
  CommanderDashboardOverview,
  CommanderDashboardTimelineEvent,
  CommanderMapHeatmapPoint,
  CommanderMapSeverity,
} from "@/features/commander-dashboard/types/commanderDashboard.types";

type HeatmapFilters = {
  from?: string;
  to?: string;
  urgencyLevel?: CommanderMapSeverity;
};

function buildQuery(filters: HeatmapFilters = {}) {
  const params = new URLSearchParams();

  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.urgencyLevel) params.set("urgencyLevel", filters.urgencyLevel);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export const commanderDashboardService = {
  getOverview: () =>
    apiClient.get<CommanderDashboardOverview>(
      endpoints.commanderDashboardOverview,
      { auth: true },
    ),

  getHeatmap: (filters?: HeatmapFilters) =>
    apiClient.get<CommanderMapHeatmapPoint[]>(
      `${endpoints.commanderDashboardHeatmap}${buildQuery(filters)}`,
      { auth: true },
    ),

  getTimeline: (limit = 20) =>
    apiClient.get<CommanderDashboardTimelineEvent[]>(
      `${endpoints.commanderDashboardTimeline}?limit=${encodeURIComponent(
        String(limit),
      )}`,
      { auth: true },
    ),
};
