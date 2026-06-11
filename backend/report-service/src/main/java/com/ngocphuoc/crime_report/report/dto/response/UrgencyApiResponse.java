package com.ngocphuoc.crime_report.report.dto.response;

public record UrgencyApiResponse<T>(
        Integer code,
        String message,
        T results
) {
}
