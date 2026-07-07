package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.request.DispatchByTrackingCodeRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AssignedDispatchTaskResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PendingDispatchCaseResponse;
import com.ngocphuoc.crime.report.dispatch.service.DispatchCaseService;
import com.ngocphuoc.crime.report.dispatch.service.DispatchTaskService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch/cases")
@Tag(name = "Dispatch Cases", description = "Dispatch case queue and manual dispatch APIs")
public class DispatchCaseController {
    private final DispatchCaseService dispatchCaseService;
    private final DispatchTaskService dispatchTaskService;

    @GetMapping("/pending")
    @Operation(summary = "List pending dispatch cases", description = "Return reports waiting for dispatch.")
    public ApiResponse<List<PendingDispatchCaseResponse>> getPendingCases() {
        return ApiResponse.<List<PendingDispatchCaseResponse>>builder()
                .data(dispatchCaseService.getPendingCases())
                .build();
    }

    @GetMapping("/{trackingCode}")
    @Operation(summary = "Get pending case detail", description = "Return dispatch case detail by tracking code.")
    public ApiResponse<PendingDispatchCaseResponse> getCaseDetail(
            @Parameter(description = "Public tracking code", example = "CR202607070001")
            @PathVariable String trackingCode
    ) {
        return ApiResponse.<PendingDispatchCaseResponse>builder()
                .data(dispatchCaseService.getCaseDetail(trackingCode))
                .build();
    }

    @PostMapping("/{trackingCode}/dispatch")
    @Operation(summary = "Dispatch case", description = "Create dispatch task for a case by tracking code.")
    public ApiResponse<AssignedDispatchTaskResponse> dispatch(
            @Parameter(description = "Public tracking code", example = "CR202607070001")
            @PathVariable String trackingCode,
            @RequestBody(required = false) DispatchByTrackingCodeRequest request
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.dispatchByTrackingCode(trackingCode, request))
                .build();
    }
}
