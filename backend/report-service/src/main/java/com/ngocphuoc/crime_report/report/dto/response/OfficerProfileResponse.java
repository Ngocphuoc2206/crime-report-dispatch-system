package com.ngocphuoc.crime_report.report.dto.response;

public record OfficerProfileResponse(
        Long officerId,
        Long userId,
        Long unitId,
        String unitName,
        String badgeNumber,
        String rankName
) {
}
