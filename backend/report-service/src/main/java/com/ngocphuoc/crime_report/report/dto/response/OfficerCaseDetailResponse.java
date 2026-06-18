package com.ngocphuoc.crime_report.report.dto.response;

import com.ngocphuoc.crime_report.enums.CaseStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OfficerCaseDetailResponse(
        Long id,
        String trackingCode,

        String description,
        String crimeType,
        CaseStatus status,
        String urgencyLevel,

        BigDecimal latitude,
        BigDecimal longitude,
        String address,

        Long assignedUnitId,
        Long assignedOfficerId,

        Boolean anonymous,

        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        List<EvidenceMetadataResponse> evidences
)  {
}
