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
        Integer spamScore,
        String spamLevel,
        String spamReasons,
        Integer fakeScore,
        Integer aiConfidence,
        String aiDecision,
        String spamDetectionSource,
        String aiModel,
        LocalDateTime aiCheckedAt,
        String aiError,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
