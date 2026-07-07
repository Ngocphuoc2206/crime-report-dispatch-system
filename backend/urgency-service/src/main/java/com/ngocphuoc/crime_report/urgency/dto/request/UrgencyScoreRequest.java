package com.ngocphuoc.crime_report.urgency.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Urgency score calculation request")
public record UrgencyScoreRequest(
        @Schema(description = "Base score from crime type or initial rule", example = "40")
        Integer baseScore,
        @Schema(description = "Whether a weapon is involved", example = "true")
        Boolean hasWeapon,
        @Schema(description = "Whether the incident is happening now", example = "true")
        Boolean isHappeningNow,
        @Schema(description = "Whether someone is injured", example = "false")
        Boolean hasInjuredPerson,
        @Schema(description = "Whether video evidence exists", example = "true")
        Boolean hasVideoEvidence
) {
}
