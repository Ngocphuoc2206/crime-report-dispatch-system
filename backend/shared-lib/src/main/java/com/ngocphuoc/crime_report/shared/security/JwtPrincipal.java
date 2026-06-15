package com.ngocphuoc.crime_report.shared.security;

import java.util.List;

public record JwtPrincipal(
        String username,
        List<String> roles
) {
}
