package com.ngocphuoc.crime_report.report.dto.response;

public record DashboardOverviewResponse(
        Long totalReports,
        Long newReports,
        Long underVerificationReports,
        Long transferredReports,
        Long resolvedReports,
        Long spamReports,
        Long criticalReports,
        Long highReports,
        Long mediumReports,
        Long lowReports
) {
}
