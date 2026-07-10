package com.ngocphuoc.crime_report.report.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ReportStatusResponse(
        String trackingCode,
        String status,
        String displayStatus,
        LocalDateTime createdAt,
        Boolean needsAdditionalEvidence,
        List<PublicCaseNotificationResponse> evidenceRequests
) {
}
