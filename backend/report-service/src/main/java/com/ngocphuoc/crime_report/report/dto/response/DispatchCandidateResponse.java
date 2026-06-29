package com.ngocphuoc.crime_report.report.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DispatchCandidateResponse(
        Long caseId,
        String trackingCode,
        String title,
        String description,
        String crimeTypeName,
        String status,
        String urgencyLevel,
        BigDecimal latitude,
        BigDecimal longitude,
        String address,
        Long assignedUnitId,
        Long assignedOfficerId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
