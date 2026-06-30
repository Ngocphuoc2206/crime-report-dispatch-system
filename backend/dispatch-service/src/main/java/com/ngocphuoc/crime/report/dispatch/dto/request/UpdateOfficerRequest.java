package com.ngocphuoc.crime.report.dispatch.dto.request;

import com.ngocphuoc.crime.report.dispatch.enums.OfficerStatus;

public record UpdateOfficerRequest(
        Long unitId,
        String badgeNumber,
        String rankName,
        OfficerStatus officerStatus
) {
}
