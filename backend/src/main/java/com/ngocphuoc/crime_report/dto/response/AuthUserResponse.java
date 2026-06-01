package com.ngocphuoc.crime_report.dto.response;

import java.util.List;

public record AuthUserResponse(
        Long id,
        String username,
        String fullName,
        List<String> roles
) {
}
