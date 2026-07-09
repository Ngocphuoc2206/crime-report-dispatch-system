package com.ngocphuoc.crime_report.report.dto.response;

public record MonthlyReportTrendResponse(
        Integer year,
        Integer month,
        String label,
        Long reportCount,
        Boolean forecast
) {
}
