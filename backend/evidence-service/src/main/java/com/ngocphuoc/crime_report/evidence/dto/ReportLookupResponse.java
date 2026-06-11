package com.ngocphuoc.crime_report.evidence.dto;

public record ReportLookupResponse(
        Long caseId,
        String trackingCode,
        String status
) {
}
