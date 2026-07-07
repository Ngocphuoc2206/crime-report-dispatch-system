package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.response.OfficerAvailabilityResponse;
import com.ngocphuoc.crime.report.dispatch.enums.AvailabilityStatus;
import com.ngocphuoc.crime.report.dispatch.service.DutyAvailabilityService;
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
@RequestMapping("/api/dispatch/officers")
@RequiredArgsConstructor
@Tag(name = "Dispatch availability")
public class DispatchAvailabilityController {
    private final DutyAvailabilityService dutyAvailabilityService;

    @GetMapping("/availability")
    @Operation(summary = "List officer availability", description = "Return current officer duty assignments, optionally filtered by availability status.")
    public ApiResponse<List<OfficerAvailabilityResponse>> getCurrentAvailability(
            @RequestParam(required = false)AvailabilityStatus status
    ){
        List<OfficerAvailabilityResponse> data = status == null ? dutyAvailabilityService.getCurrentAssignments()
                : dutyAvailabilityService.getCurrentAssignmentsByStatus(status);

        return ApiResponse.<List<OfficerAvailabilityResponse>>builder()
                .data(data)
                .build();
    }

    @GetMapping("/available")
    @Operation(summary = "List available officers", description = "Return officers currently available for dispatch.")
    public ApiResponse<List<OfficerAvailabilityResponse>> getAvailableOfficers(){
        return ApiResponse.<List<OfficerAvailabilityResponse>>builder()
                .data(dutyAvailabilityService.getCurrentAssignmentsByStatus(AvailabilityStatus.AVAILABLE))
                .build();
    }

    @GetMapping("/busy")
    @Operation(summary = "List busy officers", description = "Return officers currently busy with dispatch tasks.")
    public ApiResponse<List<OfficerAvailabilityResponse>> getBusyOfficers() {
        return ApiResponse.<List<OfficerAvailabilityResponse>>builder()
                .data(dutyAvailabilityService.getCurrentAssignmentsByStatus(AvailabilityStatus.BUSY))
                .build();
    }
}
