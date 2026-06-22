package com.ngocphuoc.crime_report.auth.dto.request;

import java.util.Set;

public record CreateUserRequest(
        String username,
        String password,
        String fullName,
        String email,
        String phone,
        Set<String> roles
) {
}
