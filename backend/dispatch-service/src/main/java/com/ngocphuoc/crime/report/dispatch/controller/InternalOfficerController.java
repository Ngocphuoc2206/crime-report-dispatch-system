package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime.report.dispatch.service.OfficerProfileService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/internal/officers")
public class InternalOfficerController {
    private final OfficerProfileService officerProfileService;

    @GetMapping("/by-user/{userId}")
    public ApiResponse<OfficerProfileResponse> getProfileByUserId(
            @PathVariable Long userId
    ){
        return ApiResponse.<OfficerProfileResponse>builder()
                .data(officerProfileService.getByUserId(userId))
                .build();
    }
}
