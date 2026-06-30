package com.ngocphuoc.crime.report.dispatch.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PendingDispatchCaseResponse(
        Long caseId,
        String trackingCode,
        String title,
        String crimeTypeName,
        String urgencyLevel,
        String status,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        String description,
        Integer spamScore,
        String spamLevel,
        String spamReasons,
        LocalDateTime createdAt,
        String suggestedUnitName,
        Double nearestDistanceKm
) {}
