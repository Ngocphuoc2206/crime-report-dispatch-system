package com.ngocphuoc.crime.report.dispatch.dto.request;

import com.ngocphuoc.crime.report.dispatch.enums.PoliceUnitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreatePoliceUnitRequest(
        @NotBlank @Size(max = 50) String code,
        @NotBlank @Size(max = 255) String name,
        @NotNull Long areaId,
        @Size(max = 500) String address,
        BigDecimal latitude,
        BigDecimal longitude,
        @NotNull PoliceUnitType unitType,
        Boolean active
) {
}
