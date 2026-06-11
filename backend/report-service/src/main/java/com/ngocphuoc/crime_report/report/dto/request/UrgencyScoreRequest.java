package com.ngocphuoc.crime_report.report.dto.request;

public record UrgencyScoreRequest(
        Integer baseScore,
        Boolean hasWeapon,
        Boolean isHappeningNow,
        Boolean hasInjuredPerson,
        Boolean hasVideoEvidence
) {
}
