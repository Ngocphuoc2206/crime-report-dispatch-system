package com.ngocphuoc.crime.report.dispatch.dto.response;

import com.ngocphuoc.crime.report.dispatch.enums.PoliceUnitType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminPoliceUnitResponse(
        Long id,
        String code,
        String name,
        Long areaId,
        String areaName,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        PoliceUnitType unitType,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
