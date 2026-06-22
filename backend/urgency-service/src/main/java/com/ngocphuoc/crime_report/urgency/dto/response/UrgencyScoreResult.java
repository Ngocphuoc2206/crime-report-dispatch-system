package com.ngocphuoc.crime_report.urgency.dto.response;

import com.ngocphuoc.crime_report.enums.UrgencyLevel;

public record UrgencyScoreResult(
        Integer score,
        UrgencyLevel level
) {
}
