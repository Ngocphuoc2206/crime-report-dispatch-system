package com.ngocphuoc.crime_report.report.dto.response;

import java.time.LocalDateTime;

public record OfficerCaseHistoryResponse(
        Long id,
        String action,
        String oldStatus,
        String newStatus,
        String note,
        Long actorUserId,
        Long actorOfficerId,
        Long actorUnitId,
        LocalDateTime createdAt
) {
}
