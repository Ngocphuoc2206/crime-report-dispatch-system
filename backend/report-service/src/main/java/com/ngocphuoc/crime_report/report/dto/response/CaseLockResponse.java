package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.CaseLockStatus;

import java.time.LocalDateTime;

public record CaseLockResponse(
        Long caseId,
        Long lockedByUserId,
        Long lockedByOfficerId,
        Long lockedByUnitId,
        CaseLockStatus caseLockStatus,
        LocalDateTime lockedAt,
        LocalDateTime expiresAt,
        Boolean lockedByMe,
        Boolean active
) {
}
