package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.response.CaseLockResponse;
import com.ngocphuoc.crime_report.report.service.CaseLockService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/officer/cases/{caseId}/lock")
public class CaseLockController {
    private final CaseLockService caseLockService;

    @PostMapping
    public ApiResponse<CaseLockResponse> acquireLock(
            @PathVariable Long caseId,
            Authentication authentication,
            HttpServletRequest httpServletRequest
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<CaseLockResponse>builder()
                .data(caseLockService.acquireLock(
                        currentUserId,
                        authentication,
                        caseId,
                        httpServletRequest
                ))
                .build();
    }

    @PostMapping("/renew")
    public ApiResponse<CaseLockResponse> renewLock(
            @PathVariable Long caseId,
            Authentication authentication
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<CaseLockResponse>builder()
                .data(caseLockService.renewLock(
                        currentUserId,
                        authentication,
                        caseId
                ))
                .build();
    }

    @DeleteMapping
    public ApiResponse<Void> releaseLock(
            @PathVariable Long caseId,
            Authentication authentication,
            HttpServletRequest httpServletRequest
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        caseLockService.releaseLock(
                currentUserId,
                authentication,
                caseId,
                httpServletRequest
        );

        return ApiResponse.<Void>builder().build();
    }

    @GetMapping
    public ApiResponse<CaseLockResponse> getLockStatus(
            @PathVariable Long caseId,
            Authentication authentication
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<CaseLockResponse>builder()
                .data(caseLockService.getLockStatus(
                        currentUserId,
                        authentication,
                        caseId
                ))
                .build();
    }
}
