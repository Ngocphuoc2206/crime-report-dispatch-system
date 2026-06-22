package com.ngocphuoc.crime_report.auth.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

public record AdminUserResponse(
        Long id,
        String username,
        String fullName,
        String email,
        String phone,
        Boolean active,
        Set<String> roles,
        LocalDateTime createdAt
) {
}
