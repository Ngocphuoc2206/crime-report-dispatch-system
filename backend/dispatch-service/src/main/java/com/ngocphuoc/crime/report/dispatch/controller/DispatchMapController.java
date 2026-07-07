package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchMapCaseResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchMapUnitResponse;
import com.ngocphuoc.crime.report.dispatch.service.DispatchMapService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch/map")
@Tag(name = "Dispatch Map", description = "Map data APIs for cases and police units")
public class DispatchMapController {
    private final DispatchMapService dispatchMapService;

    @GetMapping("/cases")
    @Operation(summary = "List map cases", description = "Return cases displayed on the dispatch map.")
    public ApiResponse<List<DispatchMapCaseResponse>> getCases() {
        return ApiResponse.<List<DispatchMapCaseResponse>>builder()
                .data(dispatchMapService.getCases())
                .build();
    }

    @GetMapping("/units")
    @Operation(summary = "List map units", description = "Return police units displayed on the dispatch map.")
    public ApiResponse<List<DispatchMapUnitResponse>> getUnits() {
        return ApiResponse.<List<DispatchMapUnitResponse>>builder()
                .data(dispatchMapService.getUnits())
                .build();
    }
}
