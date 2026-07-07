package com.ngocphuoc.crime_report.report.dto.request;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Update case status request")
public record UpdateCaseStatusRequest(
        @Schema(description = "New case status", example = "TRANSFERRED_TO_INVESTIGATION")
        @NotNull
        CaseStatus caseStatus,

        @Schema(description = "Processing note", example = "Da xac minh so bo va chuyen dieu tra")
        @Size(max = 500)
        String note
) {
}
