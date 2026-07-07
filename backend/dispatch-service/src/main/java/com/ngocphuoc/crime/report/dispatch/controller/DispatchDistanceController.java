package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.response.PoliceUnitDistanceResponse;
import com.ngocphuoc.crime.report.dispatch.service.NearestPoliceUnitService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dispatch/police-units")
@RequiredArgsConstructor
@Tag(name = "Dispatch Distance", description = "Nearest police unit search APIs")
public class DispatchDistanceController {
    private final NearestPoliceUnitService nearestPoliceUnitService;

    @GetMapping("/nearest")
    @Operation(summary = "Find nearest police units", description = "Return nearest police units by latitude and longitude.")
    public ApiResponse<List<PoliceUnitDistanceResponse>> findNearestPoliceUnits(
        @RequestParam double latitude,
        @RequestParam double longitude,
        @RequestParam(defaultValue = "5") int limit
    ){
        return ApiResponse.<List<PoliceUnitDistanceResponse>>builder()
                .data(nearestPoliceUnitService.findNearestPoliceUnits(latitude, longitude, limit))
                .build();
    }

    @GetMapping("/nearest-one")
    @Operation(summary = "Find nearest police unit", description = "Return the closest police unit by latitude and longitude.")
    public ApiResponse<PoliceUnitDistanceResponse> findNearestPoliceUnit(
            @RequestParam double latitude,
            @RequestParam double longitude
    ) {
        return ApiResponse.<PoliceUnitDistanceResponse>builder()
                .data(nearestPoliceUnitService.findNearestPoliceUnit(latitude, longitude))
                .build();
    }
}
