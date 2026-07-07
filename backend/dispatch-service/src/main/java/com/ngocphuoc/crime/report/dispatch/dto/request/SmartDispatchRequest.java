package com.ngocphuoc.crime.report.dispatch.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Smart dispatch request")
public record SmartDispatchRequest(
        @Schema(description = "Case id", example = "1")
        Long caseId,
        @Schema(description = "Incident latitude", example = "10.7769000")
        Double incidentLatitude,
        @Schema(description = "Incident longitude", example = "106.7009000")
        Double incidentLongitude,
        @Schema(description = "Whether to update assignment in report service", example = "true")
        Boolean updateReportAssignment
) {
    public boolean shouldUpdateReportAssignment() {
        return updateReportAssignment == null || updateReportAssignment;
    }
}
