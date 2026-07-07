package com.ngocphuoc.crime_report.evidence.controller;

import com.ngocphuoc.crime_report.evidence.dto.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.evidence.dto.UpdateEvidenceVerificationRequest;
import com.ngocphuoc.crime_report.evidence.service.EvidenceFileService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Evidence", description = "Officer and commander evidence review APIs")
public class OfficerEvidenceController {

    private final EvidenceFileService evidenceFileService;

    @GetMapping({
            "/api/officer/evidences/{evidenceId}/download",
            "/api/commander/evidences/{evidenceId}/download"
    })
    @Operation(summary = "Download evidence", description = "Download an evidence file by evidence id.")
    public ResponseEntity<Resource> downloadEvidence(
            @PathVariable Long evidenceId
    ) {
        return evidenceFileService.downloadEvidence(evidenceId);
    }

    @PatchMapping({
            "/api/officer/evidences/{evidenceId}/verification",
            "/api/commander/evidences/{evidenceId}/verification"
    })
    @Operation(summary = "Update evidence verification", description = "Update verification status and note for an evidence file.")
    public ApiResponse<EvidenceMetadataResponse> updateVerification(
            @PathVariable Long evidenceId,
            @RequestBody UpdateEvidenceVerificationRequest request,
            Authentication authentication
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());

        return ApiResponse.<EvidenceMetadataResponse>builder()
                .message("Evidence verification updated successfully")
                .data(evidenceFileService.updateVerification(evidenceId, currentUserId, request))
                .build();
    }

}
