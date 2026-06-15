package com.ngocphuoc.crime_report.report.dto.response;

public record InternalReportLookupResponse(
        Long caseId,
        String trackingCode,
        String status
) {
}
