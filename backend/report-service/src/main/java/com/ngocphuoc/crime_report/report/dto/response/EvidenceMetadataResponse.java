package com.ngocphuoc.crime_report.report.dto.response;

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
