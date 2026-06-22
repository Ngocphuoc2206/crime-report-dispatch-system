package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.response.DashboardOverviewResponse;
import com.ngocphuoc.crime_report.report.service.DashboardService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/commander/dashboard")
public class CommanderDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public ApiResponse<DashboardOverviewResponse> getOverview() {
        return ApiResponse.<DashboardOverviewResponse>builder()
                .message("Dashboard overview retrieved successfully")
                .data(dashboardService.getOverview())
                .build();
    }
}
