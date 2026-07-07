package com.ngocphuoc.crime_report.evidence.dto;

import com.ngocphuoc.crime_report.evidence.enums.EvidenceVerificationStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Update evidence verification request")
public record UpdateEvidenceVerificationRequest(
        @Schema(description = "Evidence verification status", example = "VERIFIED")
        EvidenceVerificationStatus status,
        @Schema(description = "Verification note", example = "File anh ro net va lien quan den vu viec")
        String note
) {
}
