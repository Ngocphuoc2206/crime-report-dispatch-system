package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.request.UpdateCaseStatusRequest;
import com.ngocphuoc.crime_report.report.dto.response.CommanderActivityResponse;
import com.ngocphuoc.crime_report.report.dto.response.CommanderCaseDetailResponse;
import com.ngocphuoc.crime_report.report.dto.response.CommanderCaseResponse;
import com.ngocphuoc.crime_report.report.service.CommanderCaseService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/commander")
public class CommanderCaseController {

    private final CommanderCaseService commanderCaseService;

    @GetMapping("/cases")
    public ApiResponse<Page<CommanderCaseResponse>> getCases(
            @RequestParam(required = false) CaseStatus status,
            @RequestParam(required = false) UrgencyLevel urgencyLevel,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                Math.min(size, 50),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return ApiResponse.<Page<CommanderCaseResponse>>builder()
                .data(commanderCaseService.getCases(status, urgencyLevel, keyword, pageable))
                .build();
    }

    @GetMapping("/cases/{trackingCode}")
    public ApiResponse<CommanderCaseDetailResponse> getDetail(
            @PathVariable String trackingCode
    ) {
        return ApiResponse.<CommanderCaseDetailResponse>builder()
                .data(commanderCaseService.getDetail(trackingCode))
                .build();
    }

    @PatchMapping("/cases/{trackingCode}/status")
    public ApiResponse<CommanderCaseDetailResponse> updateStatus(
            @PathVariable String trackingCode,
            @Valid @RequestBody UpdateCaseStatusRequest request,
            Authentication authentication
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<CommanderCaseDetailResponse>builder()
                .message("Commander case status updated successfully")
                .data(commanderCaseService.updateStatus(trackingCode, currentUserId, request))
                .build();
    }

    @GetMapping("/activity")
    public ApiResponse<List<CommanderActivityResponse>> getActivity(
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ApiResponse.<List<CommanderActivityResponse>>builder()
                .data(commanderCaseService.getActivities(limit))
                .build();
    }
}
