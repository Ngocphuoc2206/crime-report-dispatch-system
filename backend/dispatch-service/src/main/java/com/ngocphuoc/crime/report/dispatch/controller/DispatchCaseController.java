package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.request.DispatchByTrackingCodeRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AssignedDispatchTaskResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PendingDispatchCaseResponse;
import com.ngocphuoc.crime.report.dispatch.service.DispatchCaseService;
import com.ngocphuoc.crime.report.dispatch.service.DispatchTaskService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch/cases")
public class DispatchCaseController {
    private final DispatchCaseService dispatchCaseService;
    private final DispatchTaskService dispatchTaskService;

    @GetMapping("/pending")
    public ApiResponse<List<PendingDispatchCaseResponse>> getPendingCases() {
        return ApiResponse.<List<PendingDispatchCaseResponse>>builder()
                .data(dispatchCaseService.getPendingCases())
                .build();
    }

    @GetMapping("/{trackingCode}")
    public ApiResponse<PendingDispatchCaseResponse> getCaseDetail(
            @PathVariable String trackingCode
    ) {
        return ApiResponse.<PendingDispatchCaseResponse>builder()
                .data(dispatchCaseService.getCaseDetail(trackingCode))
                .build();
    }

    @PostMapping("/{trackingCode}/dispatch")
    public ApiResponse<AssignedDispatchTaskResponse> dispatch(
            @PathVariable String trackingCode,
            @RequestBody(required = false) DispatchByTrackingCodeRequest request
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.dispatchByTrackingCode(trackingCode, request))
                .build();
    }
}
