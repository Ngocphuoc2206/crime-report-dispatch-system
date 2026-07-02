package com.ngocphuoc.crime_report.report.dto.response;

import java.util.List;

public record AiSpamDetectionResult(
        int spamScore,
        int fakeScore,
        int confidence,
        String level,
        String decision,
        String recommendedAction,
        List<String> reasons,
        String model,
        String error
) {
    public static AiSpamDetectionResult fallback(String reason) {
        return new AiSpamDetectionResult(
                0,
                0,
                0,
                "NONE",
                "NEEDS_REVIEW",
                "ALLOW_WITH_WARNING",
                List.of(reason),
                null,
                reason
        );
    }
}
