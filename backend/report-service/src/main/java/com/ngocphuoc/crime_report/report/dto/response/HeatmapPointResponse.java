package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record HeatmapPointResponse(
        Long caseId,
        BigDecimal latitude,
        BigDecimal longitude,
        UrgencyLevel urgencyLevel,
        String crimeTypeName,
        CaseStatus status,
        LocalDateTime createdAt
) {
}
