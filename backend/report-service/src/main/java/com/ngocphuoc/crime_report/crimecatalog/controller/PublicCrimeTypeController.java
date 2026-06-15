package com.ngocphuoc.crime_report.crimecatalog.controller;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import com.ngocphuoc.crime_report.crimecatalog.dto.response.CrimeTypeResponse;
import com.ngocphuoc.crime_report.crimecatalog.service.CrimeCatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PublicCrimeTypeController {

    private final CrimeCatalogService crimeCatalogService;

    public PublicCrimeTypeController(CrimeCatalogService crimeCatalogService) {
        this.crimeCatalogService = crimeCatalogService;
    }

    @GetMapping("/api/public/crime-types")
    public ApiResponse<List<CrimeTypeResponse>> getCrimeTypes() {
        List<CrimeTypeResponse> crimeTypes = crimeCatalogService.getActiveCrimeTypes();

        return ApiResponse.<List<CrimeTypeResponse>>builder()
                .message("Crime types retrieved successfully")
                .data(crimeTypes)
                .build();
    }
}
