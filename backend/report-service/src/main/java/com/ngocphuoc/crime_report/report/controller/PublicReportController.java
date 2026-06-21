package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.response.CreateReportResponse;
import com.ngocphuoc.crime_report.report.dto.response.ReportStatusResponse;
import com.ngocphuoc.crime_report.report.service.CaseReportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/reports")
public class PublicReportController {

    private final CaseReportService caseReportService;
    private final ObjectMapper objectMapper;

    @GetMapping("/{trackingCode}/status")
    public ApiResponse<ReportStatusResponse> getReportStatus(
            @PathVariable String trackingCode
    ){
        ReportStatusResponse response = caseReportService.getPublicReportStatus(trackingCode);

        return ApiResponse.<ReportStatusResponse>builder()
                .message("Report status retrieved successfully")
                .data(response)
                .build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CreateReportResponse> createReport(
            @RequestParam("report") String reportJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            HttpServletRequest httpServletRequest
    ) throws Exception {
        CreateReportRequest request = objectMapper.readValue(reportJson, CreateReportRequest.class);
    
        CreateReportResponse response = caseReportService.createReport(request, files, httpServletRequest);
    
        return ApiResponse.<CreateReportResponse>builder()
                .message("Tin bao da duoc tiep nhan")
                .data(response)
                .build();
    }
}
