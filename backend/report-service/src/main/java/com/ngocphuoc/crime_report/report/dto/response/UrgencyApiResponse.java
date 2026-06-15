package com.ngocphuoc.crime_report.report.dto.response;

public record UrgencyApiResponse<T>(
        Boolean success,
        String message,
        T data,
        String errorCode
) {
}
