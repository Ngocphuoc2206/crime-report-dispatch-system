package com.ngocphuoc.crime_report.report.dto.request;

import jakarta.validation.constraints.Size;

public record RequestAdditionalEvidenceRequest(
        @Size(max = 500)
        String note
) {
}
