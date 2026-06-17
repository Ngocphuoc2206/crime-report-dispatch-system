package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseDetailResponse;
import com.ngocphuoc.crime_report.report.service.OfficerCaseDetailService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/officer/cases")
public class OfficerCaseDetailController {
    private final OfficerCaseDetailService officerCaseDetailService;

    @GetMapping("/{caseId}")
    public ApiResponse<OfficerCaseDetailResponse> getCaseDetail(
            @PathVariable Long caseId,
            Authentication authentication
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<OfficerCaseDetailResponse>builder()
                .data(officerCaseDetailService.getCaseDetail(
                        currentUserId,
                        authentication,
                        caseId
                ))
                .build();
    }
}
