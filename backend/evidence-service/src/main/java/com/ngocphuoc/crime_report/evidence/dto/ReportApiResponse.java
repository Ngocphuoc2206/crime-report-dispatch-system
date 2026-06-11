package com.ngocphuoc.crime_report.evidence.dto;

public record ReportApiResponse<T>(
        Integer code,
        String message,
        T results
) {
}