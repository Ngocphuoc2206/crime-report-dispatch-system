package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.request.UpdateReportAssignmentRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import com.ngocphuoc.crime_report.report.dto.response.InternalReportLookupResponse;
import com.ngocphuoc.crime_report.report.service.CaseReportService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/internal/reports")
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
