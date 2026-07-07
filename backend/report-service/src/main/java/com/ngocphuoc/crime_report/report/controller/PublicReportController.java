package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.response.CreateReportResponse;
import com.ngocphuoc.crime_report.report.dto.response.ReportStatusResponse;
import com.ngocphuoc.crime_report.report.service.CaseReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Public Reports", description = "Public crime report submission and tracking")
public class PublicReportController {

    private final CaseReportService caseReportService;
    private final ObjectMapper objectMapper;

    @GetMapping("/{trackingCode}/status")
    @Operation(
            summary = "Track report status",
            description = "Public endpoint for citizens to track report progress by tracking code.",
            security = {}
    )
    public ApiResponse<ReportStatusResponse> getReportStatus(
            @Parameter(description = "Tracking code returned after report submission", example = "CR202607070001")
            @PathVariable String trackingCode
    ){
        ReportStatusResponse response = caseReportService.getPublicReportStatus(trackingCode);

        return ApiResponse.<ReportStatusResponse>builder()
                .message("Report status retrieved successfully")
                .data(response)
                .build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Submit crime report",
            description = "Create a public crime report. Multipart field report contains JSON, files contains optional evidences.",
            security = {}
    )
    public ApiResponse<CreateReportResponse> createReport(
            @Parameter(description = "CreateReportRequest as JSON string")
            @RequestParam("report") String reportJson,
            @Parameter(description = "Evidence files uploaded with the report")
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
