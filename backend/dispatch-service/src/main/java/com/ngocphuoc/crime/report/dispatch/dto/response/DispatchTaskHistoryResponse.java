package com.ngocphuoc.crime.report.dispatch.dto.response;

import java.time.LocalDateTime;

public record DispatchTaskHistoryResponse(
        Long id,
        Long dispatchTaskId,
        Long caseId,
        String trackingCode,
        String title,
        String urgencyLevel,
        String action,
        String previousStatus,
        String nextStatus,
        Long previousUnitId,
        Long previousOfficerId,
        Long assignedUnitId,
        Long assignedOfficerId,
        String assignedUnitName,
        String assignedOfficerBadgeNumber,
        String reason,
        String actor,
        LocalDateTime createdAt
) {
}
