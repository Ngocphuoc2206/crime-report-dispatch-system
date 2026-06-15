package com.ngocphuoc.crime_report.report.dto.response;

public record CreateReportResponse(
        Long caseId,
        String trackingCode,
        String status,
        Integer urgencyScore,
        String urgencyLevel,
        String message
) {
}
