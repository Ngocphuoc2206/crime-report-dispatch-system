package com.ngocphuoc.crime_report.report.dto.response;

import java.util.List;

public record SpamDetectionResult(
        int score,
        String level,
        List<String> reasons
) {
}
