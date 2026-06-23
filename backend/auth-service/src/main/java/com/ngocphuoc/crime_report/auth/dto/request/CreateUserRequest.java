package com.ngocphuoc.crime_report.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CreateUserRequest(
        @NotBlank @Size(max = 100) String username,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotBlank @Size(max = 255) String fullName,
        @Email @Size(max = 255) String email,
        @Size(max = 50) String phone,
        @NotEmpty Set<@NotBlank String> roles
) {
}
