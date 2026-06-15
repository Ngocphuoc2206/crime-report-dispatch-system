package com.ngocphuoc.crime_report.report.dto.request;

public record UpdateReportAssignmentRequest(
        Long assignedUnitId,
        Long assignedOfficerId
) {
}
