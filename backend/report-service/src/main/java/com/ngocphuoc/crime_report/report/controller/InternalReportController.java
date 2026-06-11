package com.ngocphuoc.crime_report.report.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
                .results(caseReportService.getInternalReportByTrackingCode(trackingCode))
                .build();
    }
}
