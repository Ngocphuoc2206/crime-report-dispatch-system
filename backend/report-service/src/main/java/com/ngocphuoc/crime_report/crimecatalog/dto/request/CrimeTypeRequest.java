package com.ngocphuoc.crime_report.crimecatalog.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CrimeTypeRequest(
        @NotNull
        Long categoryId,

        @NotBlank
        @Size(max = 50)
        String code,

        @NotBlank
        @Size(max = 255)
        String name,

        @Size(max = 500)
        String description,
        
        @NotNull
        @Min(0)
        Integer baseScore,

        @NotNull
        Boolean isActive
) {
}
