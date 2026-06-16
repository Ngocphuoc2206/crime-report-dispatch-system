package com.ngocphuoc.crime.report.dispatch.dto.response;

public record OfficerProfileResponse (
    Long officerId,
    Long userId,
    Long unitId,
    String unitName,
    String badgeNumber,
    String rankName
    )
{}
