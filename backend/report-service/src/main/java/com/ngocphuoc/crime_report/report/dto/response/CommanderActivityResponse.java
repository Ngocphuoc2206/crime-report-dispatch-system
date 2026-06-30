package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.UrgencyLevel;

import java.time.LocalDateTime;

public record CommanderActivityResponse(
        Long id,
        Long caseId,
        String trackingCode,
        String action,
        String description,
        String actor,
        UrgencyLevel urgencyLevel,
        LocalDateTime createdAt
) {
}
