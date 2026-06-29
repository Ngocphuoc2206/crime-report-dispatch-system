package com.ngocphuoc.crime.report.dispatch.dto.response;

import java.math.BigDecimal;

public record DispatchMapUnitResponse(
        Long unitId,
        String unitCode,
        String unitName,
        String status,
        String address,
        BigDecimal latitude,
        BigDecimal longitude
) {
}
