package com.ngocphuoc.crime.report.dispatch.dto.request;

import com.ngocphuoc.crime.report.dispatch.enums.PoliceUnitType;

import java.math.BigDecimal;

public record UpdatePoliceUnitRequest(
        String code,
        String name,
        Long areaId,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        PoliceUnitType unitType,
        Boolean active
) {
}
