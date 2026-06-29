package com.ngocphuoc.crime_report.evidence.controller;

import com.ngocphuoc.crime_report.evidence.dto.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.evidence.service.EvidenceFileService;
import com.ngocphuoc.crime_report.evidence.service.EvidenceMetadataService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/internal")
@RequiredArgsConstructor
public class InternalEvidenceController {
    private final EvidenceFileService evidenceFileService;
    private final EvidenceMetadataService evidenceMetadataService;

    @PostMapping(
            value = "/reports/{trackingCode}/evidences",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map<String, Object> uploadEvidence(
            @PathVariable String trackingCode,
            @RequestPart("files") List<MultipartFile> files
    ) {
        evidenceFileService.saveEvidenceFiles(trackingCode, files);

        return Map.of(
                "message", "Evidence files uploaded successfully",
                "trackingCode", trackingCode
        );
    }

    @PostMapping(
            value = "/evidences",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map<String, Object> uploadEvidenceForCase(
            @RequestParam Long caseId,
            @RequestParam String trackingCode,
            @RequestPart("files") List<MultipartFile> files
    ) {
        evidenceFileService.saveEvidenceFiles(caseId, trackingCode, files);

        return Map.of(
                "message", "Evidence files uploaded successfully",
                "caseId", caseId,
                "trackingCode", trackingCode
        );
    }

    @GetMapping("/evidences/cases/{caseId}/metadata")
    public ApiResponse<List<EvidenceMetadataResponse>> getEvidenceMetaByCaseId(
            @PathVariable Long caseId
    ){
        return ApiResponse.<List<EvidenceMetadataResponse>>builder()
                .data(evidenceMetadataService.getEvidenceMetadataByCaseId(caseId))
                .build();
    }
}
