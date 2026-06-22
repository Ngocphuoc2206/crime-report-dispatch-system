package com.ngocphuoc.crime_report.urgency.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import com.ngocphuoc.crime_report.urgency.dto.request.UrgencyRuleRequest;
import com.ngocphuoc.crime_report.urgency.dto.request.UrgencyRuleUpdateRequest;
import com.ngocphuoc.crime_report.urgency.dto.response.UrgencyRuleResponse;
import com.ngocphuoc.crime_report.urgency.service.UrgencyAdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/urgency-rules")
public class UrgencyAdminController {

    private final UrgencyAdminService urgencyAdminService;

    @GetMapping
    public ApiResponse<List<UrgencyRuleResponse>> getAll() {
        return ApiResponse.<List<UrgencyRuleResponse>>builder()
                .data(urgencyAdminService.getAll())
                .build();
    }

    @PostMapping
    public ApiResponse<UrgencyRuleResponse> create(
            @RequestBody UrgencyRuleRequest request
    ) {
        return ApiResponse.<UrgencyRuleResponse>builder()
                .message("Urgency rule created successfully")
                .data(urgencyAdminService.createUrgencyRule(request))
                .build();
    }

    @PatchMapping("/{id}")
    public ApiResponse<UrgencyRuleResponse> update(
            @PathVariable Long id,
            @RequestBody UrgencyRuleUpdateRequest request
    ) {
        return ApiResponse.<UrgencyRuleResponse>builder()
                .message("Urgency rule updated successfully")
                .data(urgencyAdminService.updateUrgencyRule(id, request))
                .build();
    }
}
