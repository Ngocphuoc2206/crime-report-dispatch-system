package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.request.CreateOfficerRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime.report.dispatch.service.OfficerProfileService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/officers")
public class AdminOfficerController {

    private final OfficerProfileService officerProfileService;

    @PostMapping
    public ApiResponse<OfficerProfileResponse> create(
            @Valid @RequestBody CreateOfficerRequest request
    ) {
        return ApiResponse.<OfficerProfileResponse>builder()
                .message("Officer profile created successfully")
                .data(officerProfileService.createOfficer(request))
                .build();
    }
}
