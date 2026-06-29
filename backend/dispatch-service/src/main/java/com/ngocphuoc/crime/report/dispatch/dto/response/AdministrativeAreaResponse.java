package com.ngocphuoc.crime.report.dispatch.dto.response;

import com.ngocphuoc.crime.report.dispatch.enums.AreaType;

public record AdministrativeAreaResponse(
        Long id,
        String code,
        String name,
        AreaType areaType,
        Long parentId
) {
}
