package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.request.CreateOfficerRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.UpdateOfficerRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AdminOfficerResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime.report.dispatch.service.OfficerProfileService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/officers")
@Tag(name = "Admin Officers")
public class AdminOfficerController {

    private final OfficerProfileService officerProfileService;

    @GetMapping
    @Operation(summary = "List officers", description = "Return all officer profiles for administration.")
    public ApiResponse<java.util.List<AdminOfficerResponse>> getAll() {
        return ApiResponse.<java.util.List<AdminOfficerResponse>>builder()
                .data(officerProfileService.getAllForAdmin())
                .build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get officer detail", description = "Return officer profile detail by id.")
    public ApiResponse<AdminOfficerResponse> getDetail(@PathVariable Long id) {
        return ApiResponse.<AdminOfficerResponse>builder()
                .data(officerProfileService.getAdminDetail(id))
                .build();
    }

    @PostMapping
    @Operation(summary = "Create officer profile", description = "Create an officer profile linked to a user account and unit.")
    public ApiResponse<OfficerProfileResponse> create(
            @Valid @RequestBody CreateOfficerRequest request
    ) {
        return ApiResponse.<OfficerProfileResponse>builder()
                .message("Officer profile created successfully")
                .data(officerProfileService.createOfficer(request))
                .build();
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update officer profile", description = "Update officer profile metadata, unit, or status.")
    public ApiResponse<AdminOfficerResponse> update(
            @PathVariable Long id,
            @RequestBody UpdateOfficerRequest request
    ) {
        return ApiResponse.<AdminOfficerResponse>builder()
                .message("Officer profile updated successfully")
                .data(officerProfileService.updateOfficer(id, request))
                .build();
    }
}
