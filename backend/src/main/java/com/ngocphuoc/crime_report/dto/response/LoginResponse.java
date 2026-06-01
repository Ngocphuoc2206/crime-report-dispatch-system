package com.ngocphuoc.crime_report.dto.response;

import lombok.Builder;

@Builder
public record LoginResponse(
        String accessToken,
        String tokenType,
        AuthUserResponse user
) {
}
