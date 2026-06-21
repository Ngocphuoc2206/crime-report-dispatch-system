package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.CaseStatus;

import java.time.LocalDateTime;

public record UpdateCaseStatusResponse(
        Long caseId,
        String trackingCode,
        CaseStatus oldStatus,
        CaseStatus newStatus,
        String note,
        LocalDateTime updatedAt
) {
}
