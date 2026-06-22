package com.ngocphuoc.crime_report.crimecatalog.dto.response;

public record CrimeTypeResponse(
        Long id,
        String code,
        String name,
        String description,
        Integer baseScore,
        Boolean isActive,
        CrimeCategoryResponse category
) {
}
