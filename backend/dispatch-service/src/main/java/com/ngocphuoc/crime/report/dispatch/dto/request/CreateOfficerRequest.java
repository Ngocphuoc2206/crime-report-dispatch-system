package com.ngocphuoc.crime.report.dispatch.dto.request;

public record CreateOfficerRequest(
        Long userId,
        Long unitId,
        String badgeNumber,
        String rankName
) {
}
