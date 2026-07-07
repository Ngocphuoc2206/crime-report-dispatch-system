package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.response.CaseLockResponse;
import com.ngocphuoc.crime_report.report.service.CaseLockService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/officer/cases/{caseId:[0-9]+}/lock")
@Tag(name = "Case Locks", description = "Officer case editing lock APIs")
public class CaseLockController {
    private final CaseLockService caseLockService;

    @PostMapping
    @Operation(summary = "Acquire case lock", description = "Acquire an editing lock for a case.")
    public ApiResponse<CaseLockResponse> acquireLock(
            @Parameter(description = "Case id", example = "1") @PathVariable Long caseId,
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
    @Operation(summary = "Renew case lock", description = "Extend the editing lock time-to-live.")
    public ApiResponse<CaseLockResponse> renewLock(
            @Parameter(description = "Case id", example = "1") @PathVariable Long caseId,
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
    @Operation(summary = "Release case lock", description = "Release the editing lock for a case.")
    public ApiResponse<Void> releaseLock(
            @Parameter(description = "Case id", example = "1") @PathVariable Long caseId,
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
    @Operation(summary = "Get case lock status", description = "Return current lock state for a case.")
    public ApiResponse<CaseLockResponse> getLockStatus(
            @Parameter(description = "Case id", example = "1") @PathVariable Long caseId,
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
