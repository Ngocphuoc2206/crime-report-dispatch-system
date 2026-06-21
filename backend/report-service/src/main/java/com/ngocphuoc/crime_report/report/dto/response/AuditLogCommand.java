package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.AuditAction;
import com.ngocphuoc.crime_report.enums.AuditResourceType;

public record AuditLogCommand(
        Long actorUserId,
        String actorRole,

        AuditAction action,
        AuditResourceType resourceType,
        Long resourceId,

        String oldValue,
        String newValue,
        String note,

        String ipAddress,
        String userAgent,
        String detail
)
{
}
