package com.ngocphuoc.crime_report.evidence.controller;

import com.ngocphuoc.crime_report.evidence.service.EvidenceFileService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/reports")
@RequiredArgsConstructor
public class PublicEvidenceController {

    private final EvidenceFileService evidenceFileService;


    @PostMapping(
            value = "/{trackingCode}/evidences",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<Map<String, Object>> uploadEvidence(
            @PathVariable String trackingCode,
            @RequestPart("files") List<MultipartFile> files
    ) {
        evidenceFileService.saveEvidenceFiles(trackingCode, files);

        return ApiResponse.<Map<String, Object>>builder()
                .message("Evidence files uploaded successfully")
                .data(Map.of("trackingCode", trackingCode))
                .build();
    }
}
