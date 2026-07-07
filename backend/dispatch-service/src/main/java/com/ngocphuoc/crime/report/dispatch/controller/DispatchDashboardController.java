package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchActivityResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchDashboardOverviewResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PendingDispatchCaseResponse;
import com.ngocphuoc.crime.report.dispatch.service.DispatchDashboardService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch/dashboard")
@Tag(name = "Dispatch Dashboard", description = "Dispatcher overview, priority queue, and activity APIs")
public class DispatchDashboardController {
    private final DispatchDashboardService dispatchDashboardService;

    @GetMapping("/overview")
    @Operation(summary = "Get dispatch overview", description = "Return dispatcher dashboard KPI summary.")
    public ApiResponse<DispatchDashboardOverviewResponse> getOverview() {
        return ApiResponse.<DispatchDashboardOverviewResponse>builder()
                .data(dispatchDashboardService.getOverview())
                .build();
    }

    @GetMapping("/priority-queue")
    @Operation(summary = "Get priority queue", description = "Return pending cases ordered for dispatch priority.")
    public ApiResponse<List<PendingDispatchCaseResponse>> getPriorityQueue() {
        return ApiResponse.<List<PendingDispatchCaseResponse>>builder()
                .data(dispatchDashboardService.getPriorityQueue())
                .build();
    }

    @GetMapping("/activity")
    @Operation(summary = "Get dispatch activity", description = "Return latest dispatch activity entries.")
    public ApiResponse<List<DispatchActivityResponse>> getActivity(
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ApiResponse.<List<DispatchActivityResponse>>builder()
                .data(dispatchDashboardService.getActivity(limit))
                .build();
    }
}
