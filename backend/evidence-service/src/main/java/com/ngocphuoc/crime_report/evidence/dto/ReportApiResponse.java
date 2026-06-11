package com.ngocphuoc.crime_report.evidence.dto;

public record ReportApiResponse<T>(
        Boolean success,
        String message,
        T data,
        String errorCode
) {
}
