package com.ngocphuoc.crime_report.report.dto.response;

import java.time.LocalDateTime;

public record CommanderCaseHistoryResponse(
        Long id,
        String action,
        String oldStatus,
        String newStatus,
        String note,
        Long actorUserId,
        LocalDateTime createdAt
) {
}
