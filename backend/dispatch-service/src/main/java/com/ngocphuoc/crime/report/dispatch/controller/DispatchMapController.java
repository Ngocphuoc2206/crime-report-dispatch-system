package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchMapCaseResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchMapUnitResponse;
import com.ngocphuoc.crime.report.dispatch.service.DispatchMapService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch/map")
public class DispatchMapController {
    private final DispatchMapService dispatchMapService;

    @GetMapping("/cases")
    public ApiResponse<List<DispatchMapCaseResponse>> getCases() {
        return ApiResponse.<List<DispatchMapCaseResponse>>builder()
                .data(dispatchMapService.getCases())
                .build();
    }

    @GetMapping("/units")
    public ApiResponse<List<DispatchMapUnitResponse>> getUnits() {
        return ApiResponse.<List<DispatchMapUnitResponse>>builder()
                .data(dispatchMapService.getUnits())
                .build();
    }
}
