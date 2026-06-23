package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.UrgencyLevel;

import java.time.LocalDateTime;

public record TimelineEventResponse(
        Long caseId,
        String trackingCode,
        String event,
        String description,
        UrgencyLevel urgencyLevel,
        LocalDateTime createdAt
) {
}
