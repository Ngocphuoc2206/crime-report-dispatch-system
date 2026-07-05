package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.request.UpdateCaseStatusRequest;
import com.ngocphuoc.crime_report.report.dto.response.AcceptCaseResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseDetailResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseResponse;
import com.ngocphuoc.crime_report.report.dto.response.UpdateCaseStatusResponse;
import com.ngocphuoc.crime_report.report.service.OfficerCaseAcceptService;
import com.ngocphuoc.crime_report.report.service.OfficerCaseDetailService;
import com.ngocphuoc.crime_report.report.service.OfficerCaseQueryService;
import com.ngocphuoc.crime_report.report.service.OfficerCaseStatusService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/officer/cases")
public class OfficerCaseController {

    private final OfficerCaseQueryService officerCaseQueryService;
    private final OfficerCaseDetailService officerCaseDetailService;
    private final OfficerCaseAcceptService officerCaseAcceptService;
    private final OfficerCaseStatusService officerCaseStatusService;

    @GetMapping
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

    @GetMapping("/mine")
    public ApiResponse<Page<OfficerCaseResponse>> getMyCases(
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
                .data(officerCaseQueryService.getMyCases(
                        currentUserId,
                        status,
                        urgencyLevel,
                        pageable
                ))
                .build();
    }

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

    @PatchMapping("/{caseId:[0-9]+}/status")
    public ApiResponse<UpdateCaseStatusResponse> updateCaseStatus(
            @PathVariable Long caseId,
            @Valid @RequestBody UpdateCaseStatusRequest request,
            Authentication authentication,
            HttpServletRequest httpServletRequest
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<UpdateCaseStatusResponse>builder()
                .data(officerCaseStatusService.updateStatus(
                        currentUserId,
                        authentication,
                        caseId,
                        request,
                        httpServletRequest
                ))
                .build();
    }

    @PostMapping("/{caseId:[0-9]+}/accept")
    public ApiResponse<AcceptCaseResponse> acceptCase(
            @PathVariable Long caseId,
            Authentication authentication,
            HttpServletRequest httpServletRequest
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<AcceptCaseResponse>builder()
                .data(officerCaseAcceptService.acceptCase(
                        currentUserId,
                        authentication,
                        caseId,
                        httpServletRequest
                ))
                .build();
    }
}
