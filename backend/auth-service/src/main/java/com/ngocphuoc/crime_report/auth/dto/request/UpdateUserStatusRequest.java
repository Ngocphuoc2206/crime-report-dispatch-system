package com.ngocphuoc.crime_report.auth.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
        @NotNull Boolean active
) {
}
