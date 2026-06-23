package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.response.DashboardOverviewResponse;
import com.ngocphuoc.crime_report.report.dto.response.HeatmapPointResponse;
import com.ngocphuoc.crime_report.report.service.DashboardService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

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

    @GetMapping("/heatmap")
    public ApiResponse<List<HeatmapPointResponse>> getHeatmap(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to,

            @RequestParam(required = false)
            UrgencyLevel urgencyLevel
    ) {
        return ApiResponse.<List<HeatmapPointResponse>>builder()
                .message("Heatmap data retrieved successfully")
                .data(dashboardService.getHeatmap(from, to, urgencyLevel))
                .build();
    }
}
