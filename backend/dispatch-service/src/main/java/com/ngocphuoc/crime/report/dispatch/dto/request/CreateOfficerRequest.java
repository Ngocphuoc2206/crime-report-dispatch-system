package com.ngocphuoc.crime.report.dispatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateOfficerRequest(
        @NotNull Long userId,
        @NotNull Long unitId,
        @NotBlank @Size(max = 50) String badgeNumber,
        @Size(max = 100) String rankName
) {
}
