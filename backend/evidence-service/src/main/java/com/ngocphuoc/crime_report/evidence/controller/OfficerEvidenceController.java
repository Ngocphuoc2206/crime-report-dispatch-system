package com.ngocphuoc.crime_report.evidence.controller;

import com.ngocphuoc.crime_report.evidence.dto.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.evidence.dto.UpdateEvidenceVerificationRequest;
import com.ngocphuoc.crime_report.evidence.service.EvidenceFileService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OfficerEvidenceController {

    private final EvidenceFileService evidenceFileService;

    @GetMapping({
            "/api/officer/evidences/{evidenceId}/download",
            "/api/commander/evidences/{evidenceId}/download"
    })
    public ResponseEntity<Resource> downloadEvidence(
            @PathVariable Long evidenceId
    ) {
        return evidenceFileService.downloadEvidence(evidenceId);
    }

    @PatchMapping({
            "/api/officer/evidences/{evidenceId}/verification",
            "/api/commander/evidences/{evidenceId}/verification"
    })
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
