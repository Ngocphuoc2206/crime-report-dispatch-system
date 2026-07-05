package com.ngocphuoc.crime_report.report.dto.response;

import java.time.LocalDateTime;

public record OfficerAuditLogResponse(
        Long id,
        LocalDateTime occurredAt,
        Long actorUserId,
        String actorRole,
        String action,
        String resourceType,
        Long resourceId,
        String resourceCode,
        String oldValue,
        String newValue,
        String note,
        String ipAddress,
        String userAgent,
        String detail
) {
}
