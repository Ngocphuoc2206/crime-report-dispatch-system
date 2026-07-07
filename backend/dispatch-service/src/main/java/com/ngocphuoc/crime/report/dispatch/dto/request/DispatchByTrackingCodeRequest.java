package com.ngocphuoc.crime.report.dispatch.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Manual dispatch by tracking code request")
public record DispatchByTrackingCodeRequest(
        @Schema(description = "Assigned police unit id", example = "1")
        Long assignedUnitId,
        @Schema(description = "Assigned officer id", example = "1")
        Long assignedOfficerId,
        @Schema(description = "Dispatch note", example = "Dieu phoi can bo gan nhat")
        String note,
        @Schema(description = "Whether to allow smart dispatch fallback", example = "true")
        Boolean smartDispatch
) {}
