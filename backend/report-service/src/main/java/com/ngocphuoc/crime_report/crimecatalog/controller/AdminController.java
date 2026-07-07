package com.ngocphuoc.crime_report.crimecatalog.controller;

import com.ngocphuoc.crime_report.crimecatalog.dto.request.CrimeTypeRequest;
import com.ngocphuoc.crime_report.crimecatalog.dto.response.CrimeTypeResponse;
import com.ngocphuoc.crime_report.crimecatalog.service.AdminCrimeTypeService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/crime-types")
@Tag(name = "Admin Crime Types", description = "Crime type catalog administration APIs")
public class AdminController {
    private final AdminCrimeTypeService adminCrimeTypeService;

    @GetMapping
    @Operation(summary = "List crime types", description = "Return all crime types for administration.")
    public ApiResponse<List<CrimeTypeResponse>> getAllCrimeTypes(){
        return ApiResponse.<List<CrimeTypeResponse>>builder()
                .data(adminCrimeTypeService.getAll())
                .message("Crime types retrieved successfully")
                .build();
    }

    @PostMapping
    @Operation(summary = "Create crime type", description = "Create a crime type in the catalog.")
    public ApiResponse<CrimeTypeResponse> createCrimeType(
            @Valid @RequestBody CrimeTypeRequest request
    ){
        CrimeTypeResponse crimeTypeResponse = adminCrimeTypeService.createCrimeType(request);

        return ApiResponse.<CrimeTypeResponse>builder()
                .data(crimeTypeResponse)
                .message("Create crimeType is successfully")
                .build();
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update crime type", description = "Update a crime type by id.")
    public ApiResponse<CrimeTypeResponse> updateCrimeType(
            @PathVariable Long id,
            @Valid @RequestBody CrimeTypeRequest request
    ){
        return ApiResponse.<CrimeTypeResponse>builder()
                .data(adminCrimeTypeService.updateCrimeType(id, request))
                .message("Crime type updated successfully")
                .build();
    }

}
