package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.response.AcceptCaseResponse;
import com.ngocphuoc.crime_report.report.service.OfficerCaseAcceptService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/officer/cases")
public class OfficerCaseAcceptController {

    private final OfficerCaseAcceptService officerCaseAcceptService;

    @PostMapping("/{caseId}/accept")
    public ApiResponse<AcceptCaseResponse> acceptCase(
            @PathVariable Long caseId,
            Authentication authentication
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<AcceptCaseResponse>builder()
                .data(officerCaseAcceptService.acceptCase(
                        currentUserId,
                        authentication,
                        caseId
                ))
                .build();
    }
}