package com.ngocphuoc.crime_report.report.dto.response;

import java.util.List;

public record PublicProcessingFeedResponse(
        Long updatesLast24Hours,
        String headline,
        String summary,
        List<String> safetyTips,
        List<PublicCaseNotificationResponse> latestUpdates
) {
}
