package com.ngocphuoc.crime_report.report.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "Create public crime report request")
public record CreateReportRequest(

        @Schema(description = "Crime type id", example = "1")
        @NotNull(message = "Crime type is required")
        Long crimeTypeId,

        @Schema(description = "Incident description", example = "Phat hien vu cuop giat gan cho Ben Thanh")
        @NotBlank(message = "Description is required")
        String description,

        @Schema(description = "Incident time", example = "2026-07-07T10:30:00")
        LocalDateTime incidentTime,

        @Schema(description = "Whether the incident is happening now", example = "true")
        @NotNull(message = "isHappeningNow is required")
        Boolean isHappeningNow,

        @Schema(description = "Whether a weapon is involved", example = "false")
        @NotNull(message = "hasWeapon is required")
        Boolean hasWeapon,

        @Schema(description = "Whether someone is injured", example = "false")
        @NotNull(message = "hasInjuredPerson is required")
        Boolean hasInjuredPerson,

        @Schema(description = "Incident latitude", example = "10.7769000")
        @NotNull(message = "Latitude is required")
        BigDecimal latitude,

        @Schema(description = "Incident longitude", example = "106.7009000")
        @NotNull(message = "Longitude is required")
        BigDecimal longitude,

        @Schema(description = "Human-readable incident address", example = "Cho Ben Thanh, Quan 1, TP.HCM")
        @NotBlank(message = "Address text is required")
        String addressText,

        @Schema(description = "Reporter full name", example = "Nguyen Van A")
        String reporterFullName,
        @Schema(description = "Reporter citizen id", example = "079200012345")
        String reporterCitizenId,
        @Schema(description = "Reporter phone", example = "0909123456")
        String reporterPhone,
        @Schema(description = "Reporter email", example = "nguyenvana@example.com")
        String reporterEmail,
        @Schema(description = "Reporter address", example = "Quan 1, TP.HCM")
        String reporterAddress
) {
}
