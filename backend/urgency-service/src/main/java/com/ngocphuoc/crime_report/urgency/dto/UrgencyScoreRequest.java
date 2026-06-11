package com.ngocphuoc.crime_report.urgency.dto;

public record UrgencyScoreRequest(
        Integer baseScore,
        Boolean hasWeapon,
        Boolean isHappeningNow,
        Boolean hasInjuredPerson,
        Boolean hasVideoEvidence
) {
}
