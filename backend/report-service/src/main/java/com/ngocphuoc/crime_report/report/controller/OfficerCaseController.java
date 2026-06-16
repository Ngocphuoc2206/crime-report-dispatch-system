package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseResponse;
import com.ngocphuoc.crime_report.report.service.OfficerCaseQueryService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/officer")
public class OfficerCaseController {

    private final OfficerCaseQueryService officerCaseQueryService;

    @GetMapping("/cases")
    public ApiResponse<Page<OfficerCaseResponse>> getOfficerCases(
            @RequestParam(required = false) CaseStatus status,
            @RequestParam(required = false) UrgencyLevel urgencyLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        Pageable pageable = PageRequest.of(
                page,
                Math.min(size, 50),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return ApiResponse.<Page<OfficerCaseResponse>>builder()
                .data(officerCaseQueryService.getOfficerCases(
                        currentUserId,
                        authentication,
                        status,
                        urgencyLevel,
                        pageable
                ))
                .build();
    }
}
