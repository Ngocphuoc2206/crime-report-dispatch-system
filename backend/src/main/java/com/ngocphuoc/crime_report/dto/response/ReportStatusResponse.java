package com.ngocphuoc.crime_report.dto.response;

import java.time.LocalDateTime;

public record ReportStatusResponse(
        String trackingCode,
        String status,
        String displayStatus,
        LocalDateTime createdAt
) {
}
