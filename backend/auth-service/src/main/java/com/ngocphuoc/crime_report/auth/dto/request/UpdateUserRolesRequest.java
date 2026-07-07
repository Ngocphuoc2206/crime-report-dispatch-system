package com.ngocphuoc.crime_report.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

@Schema(description = "Update user roles request")
public record UpdateUserRolesRequest(
        @Schema(description = "Replacement role codes", example = "[\"OFFICER\"]")
        @NotEmpty Set<@NotBlank String> roles
) {
}
