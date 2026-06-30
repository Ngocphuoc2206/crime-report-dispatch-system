package com.ngocphuoc.crime.report.dispatch.dto.request;

public record DispatchByTrackingCodeRequest(
        Long assignedUnitId,
        Long assignedOfficerId,
        String note,
        Boolean smartDispatch
) {}
