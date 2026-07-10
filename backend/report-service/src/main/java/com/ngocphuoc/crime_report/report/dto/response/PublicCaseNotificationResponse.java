package com.ngocphuoc.crime_report.report.dto.response;

import java.time.LocalDateTime;

public record PublicCaseNotificationResponse(
        Long id,
        String type,
        String title,
        String message,
        LocalDateTime createdAt
) {
}
