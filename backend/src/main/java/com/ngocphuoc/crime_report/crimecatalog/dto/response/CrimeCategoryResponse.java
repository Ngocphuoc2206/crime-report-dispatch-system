package com.ngocphuoc.crime_report.crimecatalog.dto.response;

public record CrimeCategoryResponse(
        Long id,
        String code,
        String name,
        String defaultUrgencyLevel
) {
}
