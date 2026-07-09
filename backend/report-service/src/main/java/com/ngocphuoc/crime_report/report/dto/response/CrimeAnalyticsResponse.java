package com.ngocphuoc.crime_report.report.dto.response;

import java.util.List;

public record CrimeAnalyticsResponse(
        List<MonthlyReportTrendResponse> monthlyTrend,
        Double changePercent,
        String trendDirection,
        Long forecastReportCount,
        String forecastMethod
) {
}
