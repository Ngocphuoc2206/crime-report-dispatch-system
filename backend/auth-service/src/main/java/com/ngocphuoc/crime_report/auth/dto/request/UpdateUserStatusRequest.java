package com.ngocphuoc.crime_report.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Update user active status request")
public record UpdateUserStatusRequest(
        @Schema(description = "Whether the user account is active", example = "true")
        @NotNull Boolean active
) {
}
