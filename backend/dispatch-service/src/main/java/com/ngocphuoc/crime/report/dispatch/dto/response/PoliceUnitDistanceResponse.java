package com.ngocphuoc.crime.report.dispatch.dto.response;

import com.ngocphuoc.crime.report.dispatch.enums.PoliceUnitType;

import java.math.BigDecimal;

public record PoliceUnitDistanceResponse(
        Long unitId,
        String unitCode,
        String unitName,
        PoliceUnitType unitType,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        Double distanceKm,
        Double distanceMeters
) {
}
