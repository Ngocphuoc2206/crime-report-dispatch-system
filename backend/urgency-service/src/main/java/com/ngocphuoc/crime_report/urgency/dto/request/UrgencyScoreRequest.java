package com.ngocphuoc.crime_report.urgency.dto.request;

public record UrgencyScoreRequest(
        Integer baseScore,
        Boolean hasWeapon,
        Boolean isHappeningNow,
        Boolean hasInjuredPerson,
        Boolean hasVideoEvidence
) {
}
