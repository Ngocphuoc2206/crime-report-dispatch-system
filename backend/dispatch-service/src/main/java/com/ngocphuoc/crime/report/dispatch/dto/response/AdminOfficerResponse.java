package com.ngocphuoc.crime.report.dispatch.dto.response;

import com.ngocphuoc.crime.report.dispatch.enums.OfficerStatus;

import java.time.LocalDateTime;

public record AdminOfficerResponse(
        Long id,
        Long userId,
        Long unitId,
        String unitName,
        String badgeNumber,
        String rankName,
        OfficerStatus officerStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
