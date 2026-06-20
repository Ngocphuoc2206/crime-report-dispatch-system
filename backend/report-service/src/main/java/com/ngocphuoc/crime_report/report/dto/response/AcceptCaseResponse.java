package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.CaseStatus;

public record AcceptCaseResponse(
        Long caseId,
        String trackingCode,
        CaseStatus caseStatus,
        Long assignedUnitId,
        Long assignedOfficerId,
        CaseLockResponse lockResponse
) {
}
