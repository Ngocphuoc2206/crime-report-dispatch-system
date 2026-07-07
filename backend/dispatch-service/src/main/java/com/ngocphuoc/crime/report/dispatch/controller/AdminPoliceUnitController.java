package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.request.CreatePoliceUnitRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.UpdatePoliceUnitRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AdminPoliceUnitResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.AdministrativeAreaResponse;
import com.ngocphuoc.crime.report.dispatch.service.AdminPoliceUnitService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/units")
@Tag(name = "Admin Police Units")
public class AdminPoliceUnitController {
    private final AdminPoliceUnitService adminPoliceUnitService;

    @GetMapping
    @Operation(summary = "List police units", description = "Return all police units for administration.")
    public ApiResponse<List<AdminPoliceUnitResponse>> getUnits() {
        return ApiResponse.<List<AdminPoliceUnitResponse>>builder()
                .data(adminPoliceUnitService.getUnits())
                .build();
    }

    @PostMapping
    @Operation(summary = "Create police unit", description = "Create a police unit with location and administrative area.")
    public ApiResponse<AdminPoliceUnitResponse> create(
            @Valid @RequestBody CreatePoliceUnitRequest request
    ) {
        return ApiResponse.<AdminPoliceUnitResponse>builder()
                .message("Police unit created successfully")
                .data(adminPoliceUnitService.create(request))
                .build();
    }

    @PatchMapping("/{unitId}")
    @Operation(summary = "Update police unit", description = "Update police unit metadata, location, or status.")
    public ApiResponse<AdminPoliceUnitResponse> update(
            @PathVariable Long unitId,
            @RequestBody UpdatePoliceUnitRequest request
    ) {
        return ApiResponse.<AdminPoliceUnitResponse>builder()
                .message("Police unit updated successfully")
                .data(adminPoliceUnitService.update(unitId, request))
                .build();
    }

    @GetMapping("/areas")
    @Operation(summary = "List administrative areas", description = "Return administrative areas used by police units.")
    public ApiResponse<List<AdministrativeAreaResponse>> getAreas() {
        return ApiResponse.<List<AdministrativeAreaResponse>>builder()
                .data(adminPoliceUnitService.getAreas())
                .build();
    }
}
