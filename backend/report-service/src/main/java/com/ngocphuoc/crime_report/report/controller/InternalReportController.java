package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.request.UpdateReportAssignmentRequest;
import com.ngocphuoc.crime_report.report.dto.response.DispatchCandidateResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import com.ngocphuoc.crime_report.report.dto.response.InternalReportLookupResponse;
import com.ngocphuoc.crime_report.report.service.CaseReportService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/internal/reports")
@Hidden
public class InternalReportController {
    private final CaseReportService caseReportService;

    @GetMapping("/tracking/{trackingCode}")
    public ApiResponse<InternalReportLookupResponse> findByTrackingCode(
            @PathVariable String trackingCode
    ) {
        return ApiResponse.<InternalReportLookupResponse>builder()
                .message("Report retrieved successfully")
                .data(caseReportService.getInternalReportByTrackingCode(trackingCode))
                .build();
    }

    @GetMapping("/dispatch-candidates")
    public ApiResponse<List<DispatchCandidateResponse>> getDispatchCandidates() {
        return ApiResponse.<List<DispatchCandidateResponse>>builder()
                .data(caseReportService.getDispatchCandidates())
                .build();
    }

    @GetMapping("/{caseId}/dispatch-summary")
    public ApiResponse<DispatchCandidateResponse> getDispatchSummary(
            @PathVariable Long caseId
    ) {
        return ApiResponse.<DispatchCandidateResponse>builder()
                .data(caseReportService.getDispatchSummary(caseId))
                .build();
    }

    @PatchMapping("/{caseId}/assignment")
    public ApiResponse<Void> updateAssignment(
            @PathVariable Long caseId,
            @RequestBody UpdateReportAssignmentRequest request,
            HttpServletRequest httpServletRequest
    ) {
        caseReportService.updateAssignment(
                caseId,
                request.assignedUnitId(),
                request.assignedOfficerId(),
                httpServletRequest
        );

        return ApiResponse.<Void>builder().build();
    }
}
