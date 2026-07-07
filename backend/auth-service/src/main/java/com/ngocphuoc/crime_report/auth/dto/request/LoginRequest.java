package com.ngocphuoc.crime_report.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Login request")
public record LoginRequest(
        @Schema(description = "Username", example = "officer01")
        @NotBlank(message = "Username is required")
        String username,

        @Schema(description = "Password", example = "officer123")
        @NotBlank(message = "Password is required")
        String password
) {
}
