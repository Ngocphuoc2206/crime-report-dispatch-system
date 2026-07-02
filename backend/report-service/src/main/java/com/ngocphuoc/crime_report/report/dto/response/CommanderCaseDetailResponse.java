package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CommanderCaseDetailResponse(
        Long id,
        String trackingCode,
        String title,
        String description,
        CaseStatus status,
        UrgencyLevel urgencyLevel,
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
        LocalDateTime updatedAt,
        List<CommanderCaseHistoryResponse> histories
) {
}
