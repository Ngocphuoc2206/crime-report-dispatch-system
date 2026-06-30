package com.ngocphuoc.crime.report.dispatch.dto.request;

public record ReassignDispatchTaskRequest(
        Long assignedUnitId,
        Long assignedOfficerId,
        String reason
) {}
