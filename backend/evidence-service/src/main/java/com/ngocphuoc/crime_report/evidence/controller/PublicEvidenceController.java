package com.ngocphuoc.crime_report.evidence.controller;

import com.ngocphuoc.crime_report.evidence.service.EvidenceFileService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/reports")
@RequiredArgsConstructor
@Tag(name = "Public Evidence", description = "Public evidence upload APIs")
public class PublicEvidenceController {

    private final EvidenceFileService evidenceFileService;


    @PostMapping(
            value = "/{trackingCode}/evidences",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Operation(
            summary = "Upload evidence for report",
            description = "Upload evidence files using a public tracking code.",
            security = {}
    )
    public ApiResponse<Map<String, Object>> uploadEvidence(
            @Parameter(description = "Public tracking code", example = "CR202607070001")
            @PathVariable String trackingCode,
            @Parameter(description = "Evidence files")
            @RequestPart("files") List<MultipartFile> files
    ) {
        evidenceFileService.saveEvidenceFiles(trackingCode, files);

        return ApiResponse.<Map<String, Object>>builder()
                .message("Evidence files uploaded successfully")
                .data(Map.of("trackingCode", trackingCode))
                .build();
    }
}
