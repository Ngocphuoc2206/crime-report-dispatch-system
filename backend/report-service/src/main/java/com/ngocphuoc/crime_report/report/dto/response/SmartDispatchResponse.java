package com.ngocphuoc.crime_report.report.dto.response;

public record SmartDispatchResponse(
        Long dispatchTaskId,
        Long caseId,
        Long assignedUnitId,
        String assignedUnitCode,
        String assignedUnitName,
        Long assignedOfficerId,
        Long assignedOfficerUserId,
        String assignedOfficerBadgeNumber,
        String assignedOfficerRankName,
        Double distanceKm,
        String dispatchStatus
) {
}
