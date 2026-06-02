package com.ngocphuoc.crime_report.controller;

import com.ngocphuoc.crime_report.common.ApiResponse;
import com.ngocphuoc.crime_report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.dto.response.CreateReportResponse;
import com.ngocphuoc.crime_report.service.CaseReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/reports")
public class PublicReportController {

    private final CaseReportService caseReportService;



    @PostMapping
    public ApiResponse<CreateReportResponse> createReport(
            @Valid @RequestBody CreateReportRequest request
    ) {
        CreateReportResponse response = caseReportService.createReport(request);

        return ApiResponse.<CreateReportResponse>builder()
                .message("Tin báo đã được tiếp nhận")
                .results(response)
                .build();
    }
}
