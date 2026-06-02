package com.ngocphuoc.crime_report.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateReportRequest(

        @NotNull(message = "Crime type is required")
        Long crimeTypeId,

        @NotBlank(message = "Description is required")
        String description,

        LocalDateTime incidentTime,

        @NotNull(message = "isHappeningNow is required")
        Boolean isHappeningNow,

        @NotNull(message = "hasWeapon is required")
        Boolean hasWeapon,

        @NotNull(message = "hasInjuredPerson is required")
        Boolean hasInjuredPerson,

        @NotNull(message = "Latitude is required")
        BigDecimal latitude,

        @NotNull(message = "Longitude is required")
        BigDecimal longitude,

        @NotBlank(message = "Address text is required")
        String addressText
) {
}
