package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.response.OfficerAuditLogResponse;
import com.ngocphuoc.crime_report.report.service.OfficerAuditLogQueryService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/officer/audit-logs")
public class OfficerAuditLogController {

    private final OfficerAuditLogQueryService officerAuditLogQueryService;

    @GetMapping
    public ApiResponse<Page<OfficerAuditLogResponse>> getAuditLogs(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to,

            @RequestParam(required = false) String action,
            @RequestParam(required = false) String actorKeyword,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                Math.min(size, 100),
                Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.DESC, "id"))
        );

        return ApiResponse.<Page<OfficerAuditLogResponse>>builder()
                .message("Audit logs retrieved successfully")
                .data(officerAuditLogQueryService.getAuditLogs(
                        from,
                        to,
                        action,
                        actorKeyword,
                        keyword,
                        pageable
                ))
                .build();
    }
}
