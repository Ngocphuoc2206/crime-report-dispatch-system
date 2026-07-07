package com.ngocphuoc.crime_report.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Set;

@Schema(description = "Create user request")
public record CreateUserRequest(
        @Schema(description = "Unique username", example = "dispatcher02")
        @NotBlank @Size(max = 100) String username,
        @Schema(description = "Initial password", example = "dispatcher123")
        @NotBlank @Size(min = 8, max = 100) String password,
        @Schema(description = "Full name", example = "Nguyen Van B")
        @NotBlank @Size(max = 255) String fullName,
        @Schema(description = "Email address", example = "dispatcher02@example.com")
        @Email @Size(max = 255) String email,
        @Schema(description = "Phone number", example = "0909123456")
        @Size(max = 50) String phone,
        @Schema(description = "Assigned role codes", example = "[\"DISPATCHER\"]")
        @NotEmpty Set<@NotBlank String> roles
) {
}
