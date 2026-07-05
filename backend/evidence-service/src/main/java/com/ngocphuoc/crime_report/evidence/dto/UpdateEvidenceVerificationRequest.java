package com.ngocphuoc.crime_report.evidence.dto;

import com.ngocphuoc.crime_report.evidence.enums.EvidenceVerificationStatus;

public record UpdateEvidenceVerificationRequest(
        EvidenceVerificationStatus status,
        String note
) {
}
