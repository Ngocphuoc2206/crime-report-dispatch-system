package com.ngocphuoc.crime_report.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record UpdateUserRolesRequest(
        @NotEmpty Set<@NotBlank String> roles
) {
}
