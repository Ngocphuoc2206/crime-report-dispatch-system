package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchActivityResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchDashboardOverviewResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PendingDispatchCaseResponse;
import com.ngocphuoc.crime.report.dispatch.service.DispatchDashboardService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch/dashboard")
public class DispatchDashboardController {
    private final DispatchDashboardService dispatchDashboardService;

    @GetMapping("/overview")
    public ApiResponse<DispatchDashboardOverviewResponse> getOverview() {
        return ApiResponse.<DispatchDashboardOverviewResponse>builder()
                .data(dispatchDashboardService.getOverview())
                .build();
    }

    @GetMapping("/priority-queue")
    public ApiResponse<List<PendingDispatchCaseResponse>> getPriorityQueue() {
        return ApiResponse.<List<PendingDispatchCaseResponse>>builder()
                .data(dispatchDashboardService.getPriorityQueue())
                .build();
    }

    @GetMapping("/activity")
    public ApiResponse<List<DispatchActivityResponse>> getActivity(
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ApiResponse.<List<DispatchActivityResponse>>builder()
                .data(dispatchDashboardService.getActivity(limit))
                .build();
    }
}
