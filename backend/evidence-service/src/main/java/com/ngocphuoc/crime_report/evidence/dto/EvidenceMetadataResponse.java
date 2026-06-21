package com.ngocphuoc.crime_report.evidence.dto;

import java.time.LocalDateTime;

public record EvidenceMetadataResponse(
        Long id,
        Long caseId,
        String originalFilename,
        String contentType,
        Long sizeBytes,
        String fileType,
        String checksumSha256,
        LocalDateTime uploadedAt
) {
}
