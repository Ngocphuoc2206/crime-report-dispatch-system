package com.ngocphuoc.crime.report.dispatch.dto.response;

import java.math.BigDecimal;

public record DispatchMapCaseResponse(
        Long caseId,
        String trackingCode,
        String title,
        String urgencyLevel,
        String status,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        Long assignedUnitId,
        Long assignedOfficerId
) {
}
