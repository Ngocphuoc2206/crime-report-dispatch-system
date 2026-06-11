package com.ngocphuoc.crime_report.evidence.controller;

import com.ngocphuoc.crime_report.evidence.service.EvidenceFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/officer/evidences")
@RequiredArgsConstructor
public class OfficerEvidenceController {

    private final EvidenceFileService evidenceFileService;

    @GetMapping("/{evidenceId}/download")
    public ResponseEntity<Resource> downloadEvidence(
            @PathVariable Long evidenceId
    ) {
        return evidenceFileService.downloadEvidence(evidenceId);
    }

}
