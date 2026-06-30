package com.ngocphuoc.crime.report.dispatch.dto.response;

public record InternalReportLookupResponse(
        Long caseId,
        String trackingCode,
        String status
) {
}
