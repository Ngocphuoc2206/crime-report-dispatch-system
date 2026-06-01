package com.ngocphuoc.crime_report.dto.response;

public record CrimeTypeResponse(
        Long id,
        String code,
        String name,
        String description,
        Integer baseScore,
        CrimeCategoryResponse category
) {
}
