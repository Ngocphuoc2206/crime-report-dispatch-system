package com.ngocphuoc.crime.report.dispatch.dto.response;

import com.ngocphuoc.crime.report.dispatch.enums.DispatchStatus;

public record SmartDispatchResponse(
        Long dispatchTaskId,
        Long caseId,

        Long assignedUnitId,
        String assignedUnitCode,
        String assignedUnitName,

        Long assignedOfficerId,
        Long assignedOfficerUserId,
        String badgeNumber,
        String rankName,

        Double distanceKm,
        DispatchStatus dispatchStatus
) {
}
