package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.response.PoliceUnitDistanceResponse;
import com.ngocphuoc.crime.report.dispatch.service.NearestPoliceUnitService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dispatch/police-units")
@RequiredArgsConstructor
public class DispatchDistanceController {
    private final NearestPoliceUnitService nearestPoliceUnitService;

    @GetMapping("/nearest")
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
    public ApiResponse<PoliceUnitDistanceResponse> findNearestPoliceUnit(
            @RequestParam double latitude,
            @RequestParam double longitude
    ) {
        return ApiResponse.<PoliceUnitDistanceResponse>builder()
                .data(nearestPoliceUnitService.findNearestPoliceUnit(latitude, longitude))
                .build();
    }
}
