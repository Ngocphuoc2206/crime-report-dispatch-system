package com.ngocphuoc.crime.report.dispatch.dto.response;

import java.time.LocalDateTime;

public record DispatchActivityResponse(
        Long id,
        Long caseId,
        String trackingCode,
        String action,
        String description,
        String urgencyLevel,
        LocalDateTime createdAt
) {
}
