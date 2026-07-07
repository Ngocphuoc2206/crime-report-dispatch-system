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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Officer Cases", description = "Officer case queue, detail, acceptance, and status update APIs")
public class OfficerCaseController {

    private final OfficerCaseQueryService officerCaseQueryService;
    private final OfficerCaseDetailService officerCaseDetailService;
    private final OfficerCaseAcceptService officerCaseAcceptService;
    private final OfficerCaseStatusService officerCaseStatusService;

    @GetMapping
    @Operation(summary = "List accessible cases", description = "Return paginated cases that the authenticated officer can view.")
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
    @Operation(summary = "List my cases", description = "Return paginated cases assigned to the authenticated officer.")
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
    @Operation(summary = "Get case detail", description = "Return full case detail for an officer.")
    public ApiResponse<OfficerCaseDetailResponse> getCaseDetail(
            @Parameter(description = "Case id", example = "1") @PathVariable Long caseId,
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
    @Operation(summary = "Update case status", description = "Update processing status and record audit information.")
    public ApiResponse<UpdateCaseStatusResponse> updateCaseStatus(
            @Parameter(description = "Case id", example = "1") @PathVariable Long caseId,
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
    @Operation(summary = "Accept case", description = "Officer accepts the case for processing.")
    public ApiResponse<AcceptCaseResponse> acceptCase(
            @Parameter(description = "Case id", example = "1") @PathVariable Long caseId,
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
