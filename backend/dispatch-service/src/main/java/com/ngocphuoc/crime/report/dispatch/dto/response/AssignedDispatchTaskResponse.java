package com.ngocphuoc.crime.report.dispatch.dto.response;

import com.ngocphuoc.crime.report.dispatch.enums.DispatchStatus;

import java.time.LocalDateTime;

public record AssignedDispatchTaskResponse(
        Long taskId,
        Long caseId,
        String trackingCode,
        String title,
        String urgencyLevel,
        String address,
        Long assignedUnitId,
        String assignedUnitCode,
        String assignedUnitName,
        Long assignedOfficerId,
        Long assignedOfficerUserId,
        String badgeNumber,
        String rankName,
        Double distanceKm,
        DispatchStatus dispatchStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
