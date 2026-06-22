package com.ngocphuoc.crime_report.crimecatalog.controller;

import com.ngocphuoc.crime_report.crimecatalog.dto.request.CrimeTypeRequest;
import com.ngocphuoc.crime_report.crimecatalog.dto.response.CrimeTypeResponse;
import com.ngocphuoc.crime_report.crimecatalog.service.AdminCrimeTypeService;
import com.ngocphuoc.crime_report.crimecatalog.service.CrimeCatalogService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/crime-types")
public class AdminController {
    private final AdminCrimeTypeService adminCrimeTypeService;

    @GetMapping
    public ApiResponse<List<CrimeTypeResponse>> getAllCrimeTypes(){
        return ApiResponse.<List<CrimeTypeResponse>>builder()
                .data(adminCrimeTypeService.getAll())
                .message("Crime types retrieved successfully")
                .build();
    }

    @PostMapping
    public ApiResponse<CrimeTypeResponse> createCrimeType(CrimeTypeRequest request){
        CrimeTypeResponse crimeTypeResponse = adminCrimeTypeService.createCrimeType(request);

        return ApiResponse.<CrimeTypeResponse>builder()
                .data(crimeTypeResponse)
                .message("Create crimeType is successfully")
                .build();
    }

    @PatchMapping("/{id}")
    public ApiResponse<CrimeTypeResponse> updateCrimeType(@PathVariable Long id, CrimeTypeRequest request){
        return ApiResponse.<CrimeTypeResponse>builder()
                .data(adminCrimeTypeService.updateCrimeType(id, request))
                .message("Crime type updated successfully")
                .build();
    }

}
